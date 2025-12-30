#!/usr/bin/env node

/**
 * Lyra RealTime Meditation Audio Generator for SonidoVivo
 *
 * Generates ambient meditation music using Gemini Lyra RealTime,
 * analyzes existing reference tracks, and iteratively refines
 * prompts until quality matches the original Eva Julián recordings.
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs/promises';
import { createWriteStream, createReadStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment');
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });
const OUTPUT_DIR = path.join(__dirname, 'public', 'audio');
const REFERENCE_AUDIO = path.join(OUTPUT_DIR, 'BA79-El-Templo-de-Agua-de-Maria-Magdalena.mp3');

// Audio generation parameters optimized for meditation
const AUDIO_PARAMS = {
  bpm: 65,                    // Slow, meditative tempo
  temperature: 1.2,           // Creative but controlled
  density: 0.4,               // Sparse, ambient texture
  brightness: 0.5,            // Warm, not harsh
  instruments: [
    'ambient pads',
    'ethereal synths',
    'nature sounds',
    'meditation bowls',
    'soft flutes',
    'gentle bells'
  ]
};

// Track generation queue
const TRACKS_TO_GENERATE = [
  {
    title: 'Sanación del Agua Sagrada',
    theme: 'sacred water healing',
    duration: 3500, // ~58 minutes
    color: '#6BA4B8'
  },
  {
    title: 'Viaje al Templo Interior',
    theme: 'inner temple journey',
    duration: 5000, // ~83 minutes
    color: '#8B9B7F'
  }
];

/**
 * Analyze reference audio using Gemini multimodal
 */
async function analyzeReferenceAudio() {
  console.log('\n🔍 Analyzing reference audio...');

  try {
    const audioBuffer = await fs.readFile(REFERENCE_AUDIO);
    const audioBase64 = audioBuffer.toString('base64');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'audio/mp3',
          data: audioBase64
        }
      },
      `Analyze this meditation audio and describe:
1. Overall mood and atmosphere (ethereal, grounding, peaceful, etc.)
2. Predominant instruments and sounds
3. Tempo and rhythm characteristics
4. Sonic textures and layers
5. Energy level (low, medium, high)
6. Any recurring patterns or motifs
7. Recommended BPM range
8. Brightness/warmth level (0-1 scale)
9. Density of arrangement (sparse, moderate, dense)

Provide a concise analysis focused on recreating this style.`
    ]);

    const analysis = result.response.text();
    console.log('\n📊 Reference Audio Analysis:');
    console.log(analysis);

    return analysis;
  } catch (error) {
    console.error('❌ Error analyzing reference audio:', error.message);
    return null;
  }
}

/**
 * Generate meditation audio prompt based on reference analysis
 */
function generatePrompt(trackConfig, referenceAnalysis) {
  const { title, theme } = trackConfig;
  const { bpm, temperature, density, brightness, instruments } = AUDIO_PARAMS;

  const instrumentList = instruments.join(', ');

  return `Create a ${Math.floor(trackConfig.duration / 60)}-minute ambient meditation soundscape titled "${title}".

Theme: ${theme}

Musical Characteristics:
- BPM: ${bpm} (slow, meditative)
- Mood: ethereal, peaceful, grounding, sacred
- Instruments: ${instrumentList}
- Texture: sparse and spacious with gentle layers
- Energy: low to medium, calming and introspective
- Brightness: warm (${brightness * 100}%)
- Density: ambient (${density * 100}%)

Style Reference:
${referenceAnalysis ? referenceAnalysis.substring(0, 500) : 'Ethereal ambient meditation with natural elements'}

Create a continuous, flowing soundscape that evolves gently, suitable for deep meditation and healing work.`;
}

/**
 * Generate audio using Lyra RealTime API
 */
async function generateAudioWithLyra(prompt, duration, outputPath) {
  console.log(`\n🎵 Generating audio with Lyra RealTime...`);
  console.log(`Duration: ${Math.floor(duration / 60)} minutes`);
  console.log(`Output: ${outputPath}`);

  try {
    const model = genAI.getGenerativeModel({ model: 'lyra-realtime-preview' });

    // Generate audio using Lyra RealTime
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        temperature: AUDIO_PARAMS.temperature,
        audioConfig: {
          format: 'PCM_16',
          sampleRate: 24000
        }
      }
    });

    // Extract PCM audio data
    const audioData = result.response.candidates[0].content.parts[0].inlineData;

    if (!audioData || !audioData.data) {
      throw new Error('No audio data received from Lyra');
    }

    // Save raw PCM
    const pcmPath = outputPath.replace('.mp3', '.pcm');
    await fs.writeFile(pcmPath, Buffer.from(audioData.data, 'base64'));

    console.log(`✅ PCM audio saved: ${pcmPath}`);

    // Convert PCM to MP3 using FFmpeg
    await convertPCMtoMP3(pcmPath, outputPath);

    // Clean up PCM file
    await fs.unlink(pcmPath);

    return outputPath;
  } catch (error) {
    console.error('❌ Error generating audio:', error.message);
    throw error;
  }
}

/**
 * Convert PCM to MP3 using FFmpeg
 */
async function convertPCMtoMP3(pcmPath, mp3Path) {
  console.log('\n🔄 Converting PCM to MP3...');

  try {
    // Check if ffmpeg is installed
    try {
      await execAsync('which ffmpeg');
    } catch {
      console.error('❌ FFmpeg not found. Installing via Homebrew...');
      await execAsync('brew install ffmpeg');
    }

    // Convert PCM to MP3
    // Lyra outputs PCM_16 at 24000 Hz, mono
    const command = `ffmpeg -f s16le -ar 24000 -ac 1 -i "${pcmPath}" -codec:a libmp3lame -b:a 192k "${mp3Path}" -y`;

    await execAsync(command);
    console.log(`✅ MP3 conversion complete: ${mp3Path}`);
  } catch (error) {
    console.error('❌ Error converting PCM to MP3:', error.message);
    throw error;
  }
}

/**
 * Compare generated audio with reference using Gemini multimodal
 */
async function compareAudioQuality(generatedPath, referencePath) {
  console.log('\n🔬 Comparing generated audio with reference...');

  try {
    const [generatedBuffer, referenceBuffer] = await Promise.all([
      fs.readFile(generatedPath),
      fs.readFile(referencePath)
    ]);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'audio/mp3',
          data: referenceBuffer.toString('base64')
        }
      },
      {
        inlineData: {
          mimeType: 'audio/mp3',
          data: generatedBuffer.toString('base64')
        }
      },
      `Compare these two meditation audio tracks and provide:

1. Quality Score (0-100): How well does the generated audio match the reference style?
2. Similarities: What aspects match well?
3. Differences: What needs improvement?
4. Recommendations: Specific adjustments to make (BPM, instruments, density, brightness, etc.)

Focus on:
- Overall mood and atmosphere matching
- Instrumentation and sonic palette
- Tempo and rhythm alignment
- Texture and density similarity
- Production quality

Provide actionable feedback for the next iteration.`
    ]);

    const comparison = result.response.text();
    console.log('\n📊 Audio Comparison Result:');
    console.log(comparison);

    // Extract quality score
    const scoreMatch = comparison.match(/Quality Score.*?(\d+)/i);
    const qualityScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    return {
      score: qualityScore,
      feedback: comparison
    };
  } catch (error) {
    console.error('❌ Error comparing audio:', error.message);
    return { score: 0, feedback: error.message };
  }
}

/**
 * Iterative generation with quality refinement
 */
async function generateTrackWithRefinement(trackConfig, referenceAnalysis, maxIterations = 3) {
  console.log(`\n\n${'='.repeat(60)}`);
  console.log(`🎼 Generating: ${trackConfig.title}`);
  console.log(`${'='.repeat(60)}`);

  let bestScore = 0;
  let bestPath = null;
  let currentPrompt = generatePrompt(trackConfig, referenceAnalysis);

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    console.log(`\n🔄 Iteration ${iteration}/${maxIterations}`);

    const filename = `${trackConfig.title.replace(/\s+/g, '-')}_v${iteration}.mp3`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    try {
      // Generate audio
      await generateAudioWithLyra(currentPrompt, trackConfig.duration, outputPath);

      // Compare with reference
      const comparison = await compareAudioQuality(outputPath, REFERENCE_AUDIO);

      console.log(`\n📈 Quality Score: ${comparison.score}/100`);

      if (comparison.score > bestScore) {
        bestScore = comparison.score;
        bestPath = outputPath;
        console.log(`✨ New best version! Score: ${bestScore}`);
      }

      // If score is good enough, stop iterating
      if (comparison.score >= 85) {
        console.log(`\n🎉 Quality threshold met! Score: ${comparison.score}`);
        break;
      }

      // If not last iteration, refine prompt based on feedback
      if (iteration < maxIterations) {
        console.log('\n🔧 Refining prompt based on feedback...');
        currentPrompt = refinePrompt(currentPrompt, comparison.feedback);
      }

    } catch (error) {
      console.error(`❌ Iteration ${iteration} failed:`, error.message);
    }
  }

  return {
    path: bestPath,
    score: bestScore,
    config: trackConfig
  };
}

/**
 * Refine prompt based on Gemini feedback
 */
function refinePrompt(originalPrompt, feedback) {
  // Extract recommendations from feedback
  const lowerFeedback = feedback.toLowerCase();

  let refinements = [];

  if (lowerFeedback.includes('slower') || lowerFeedback.includes('decrease bpm')) {
    AUDIO_PARAMS.bpm = Math.max(55, AUDIO_PARAMS.bpm - 5);
    refinements.push(`Slower tempo (BPM: ${AUDIO_PARAMS.bpm})`);
  }

  if (lowerFeedback.includes('faster') || lowerFeedback.includes('increase bpm')) {
    AUDIO_PARAMS.bpm = Math.min(75, AUDIO_PARAMS.bpm + 5);
    refinements.push(`Faster tempo (BPM: ${AUDIO_PARAMS.bpm})`);
  }

  if (lowerFeedback.includes('more sparse') || lowerFeedback.includes('less dense')) {
    AUDIO_PARAMS.density = Math.max(0.2, AUDIO_PARAMS.density - 0.1);
    refinements.push(`More sparse arrangement (density: ${AUDIO_PARAMS.density})`);
  }

  if (lowerFeedback.includes('more dense') || lowerFeedback.includes('fuller')) {
    AUDIO_PARAMS.density = Math.min(0.6, AUDIO_PARAMS.density + 0.1);
    refinements.push(`Fuller arrangement (density: ${AUDIO_PARAMS.density})`);
  }

  if (lowerFeedback.includes('warmer') || lowerFeedback.includes('less bright')) {
    AUDIO_PARAMS.brightness = Math.max(0.3, AUDIO_PARAMS.brightness - 0.1);
    refinements.push(`Warmer tone (brightness: ${AUDIO_PARAMS.brightness})`);
  }

  if (lowerFeedback.includes('brighter') || lowerFeedback.includes('more clarity')) {
    AUDIO_PARAMS.brightness = Math.min(0.7, AUDIO_PARAMS.brightness + 0.1);
    refinements.push(`Brighter tone (brightness: ${AUDIO_PARAMS.brightness})`);
  }

  console.log(`\n🎛️ Applied refinements: ${refinements.join(', ')}`);

  // Update prompt with refinements
  let refinedPrompt = originalPrompt;

  // Update BPM in prompt
  refinedPrompt = refinedPrompt.replace(/BPM: \d+/, `BPM: ${AUDIO_PARAMS.bpm}`);
  refinedPrompt = refinedPrompt.replace(/Brightness: warm \(\d+%\)/, `Brightness: warm (${Math.round(AUDIO_PARAMS.brightness * 100)}%)`);
  refinedPrompt = refinedPrompt.replace(/Density: ambient \(\d+%\)/, `Density: ambient (${Math.round(AUDIO_PARAMS.density * 100)}%)`);

  // Add feedback insights
  if (refinements.length > 0) {
    refinedPrompt += `\n\nRefinements based on previous iteration:\n${refinements.join('\n')}`;
  }

  return refinedPrompt;
}

/**
 * Update App.jsx with generated tracks
 */
async function updateAppWithNewTracks(generatedTracks) {
  console.log('\n\n📝 Updating App.jsx with new tracks...');

  const appPath = path.join(__dirname, 'src', 'App.jsx');
  let appContent = await fs.readFile(appPath, 'utf-8');

  // Find the audioFiles array
  const audioFilesMatch = appContent.match(/const audioFiles = \[([\s\S]*?)\]/);

  if (!audioFilesMatch) {
    console.error('❌ Could not find audioFiles array in App.jsx');
    return;
  }

  // Parse existing tracks
  const existingTracksStr = audioFilesMatch[1];
  const existingTracks = existingTracksStr.match(/\{[^}]+\}/g) || [];

  // Get current max ID
  const maxId = Math.max(...existingTracks.map(t => {
    const match = t.match(/id:\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }));

  // Create new track entries
  let newId = maxId + 1;
  const newTrackEntries = generatedTracks.map(track => {
    const filename = path.basename(track.path);
    const duration = `${Math.floor(track.config.duration / 60)}:00`; // Approximate

    return `  {
    id: ${newId++},
    title: '${track.config.title}',
    artist: 'Eva Julián + AI',
    file: '/audio/${filename}',
    duration: '${duration}',
    color: '${track.config.color}'
  }`;
  });

  // Combine existing and new tracks
  const allTracksStr = existingTracksStr.trim() + ',\n' + newTrackEntries.join(',\n');

  // Replace in app content
  appContent = appContent.replace(
    /const audioFiles = \[[\s\S]*?\]/,
    `const audioFiles = [\n${allTracksStr}\n]`
  );

  await fs.writeFile(appPath, appContent, 'utf-8');
  console.log(`✅ Added ${newTrackEntries.length} new tracks to App.jsx`);
}

/**
 * Main execution flow
 */
async function main() {
  console.log('🎼 Lyra RealTime Meditation Audio Generator');
  console.log('=' .repeat(60));

  try {
    // Step 1: Analyze reference audio
    const referenceAnalysis = await analyzeReferenceAudio();

    if (!referenceAnalysis) {
      console.warn('⚠️  Proceeding without reference analysis');
    }

    // Step 2: Generate tracks with iterative refinement
    const generatedTracks = [];

    for (const trackConfig of TRACKS_TO_GENERATE) {
      const result = await generateTrackWithRefinement(trackConfig, referenceAnalysis);

      if (result.path) {
        generatedTracks.push(result);
        console.log(`\n✅ Generated: ${trackConfig.title}`);
        console.log(`   Path: ${result.path}`);
        console.log(`   Final Score: ${result.score}/100`);
      }
    }

    // Step 3: Update App.jsx
    if (generatedTracks.length > 0) {
      await updateAppWithNewTracks(generatedTracks);

      console.log('\n\n🎉 Generation Complete!');
      console.log('=' .repeat(60));
      console.log(`Generated ${generatedTracks.length} new meditation tracks`);
      console.log('\nGenerated files:');
      generatedTracks.forEach(t => {
        console.log(`  ✅ ${t.config.title} (Score: ${t.score}/100)`);
      });

      console.log('\n📌 Next steps:');
      console.log('  1. Review generated audio files');
      console.log('  2. Run: npm run build');
      console.log('  3. Deploy to verify changes');
    } else {
      console.log('\n⚠️  No tracks were successfully generated');
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { generateAudioWithLyra, analyzeReferenceAudio, compareAudioQuality };
