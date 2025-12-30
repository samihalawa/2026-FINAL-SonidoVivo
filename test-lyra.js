#!/usr/bin/env node

/**
 * Test script to validate Lyra RealTime integration
 * Generates a short 15-second meditation sample
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment');
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });
const OUTPUT_DIR = path.join(__dirname, 'public', 'audio');
const REFERENCE_AUDIO = path.join(OUTPUT_DIR, 'BA79-El-Templo-de-Agua-de-Maria-Magdalena.mp3');

async function testReferenceAnalysis() {
  console.log('\n🔍 Test 1: Reference Audio Analysis');
  console.log('=' .repeat(50));

  try {
    const audioBuffer = await fs.readFile(REFERENCE_AUDIO);
    const audioBase64 = audioBuffer.toString('base64');

    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: 'audio/mp3',
                data: audioBase64
              }
            },
            {
              text: 'Analyze this meditation audio in 3 sentences: mood, instruments, and tempo.'
            }
          ]
        }
      ]
    });

    const analysis = result.text;
    console.log('✅ Reference analysis successful');
    console.log('\nAnalysis:', analysis);
    return true;
  } catch (error) {
    console.error('❌ Reference analysis failed:', error.message);
    return false;
  }
}

async function testLyraGeneration() {
  console.log('\n\n🎵 Test 2: Lyra RealTime Generation (15 seconds)');
  console.log('=' .repeat(50));

  const prompt = `Create a 15-second ambient meditation soundscape with:
- BPM: 65 (slow, meditative)
- Instruments: soft ambient pads, gentle bells
- Mood: peaceful, ethereal
- Texture: sparse and spacious`;

  try {
    console.log('Generating audio with Lyra RealTime...');

    const result = await genAI.models.generateContent({
      model: 'lyra-realtime-preview',
      contents: prompt,
      config: {
        responseModalities: ['AUDIO'],
        temperature: 1.2,
        audioConfig: {
          format: 'PCM_16',
          sampleRate: 24000
        }
      }
    });

    // Find audio part in response
    let audioData = null;
    if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
      for (const part of result.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.includes('audio')) {
          audioData = part.inlineData;
          break;
        }
      }
    }

    if (!audioData || !audioData.data) {
      throw new Error('No audio data received from Lyra');
    }

    // Save PCM
    const pcmPath = path.join(OUTPUT_DIR, 'test-lyra.pcm');
    const mp3Path = path.join(OUTPUT_DIR, 'test-lyra.mp3');

    await fs.writeFile(pcmPath, Buffer.from(audioData.data, 'base64'));
    console.log('✅ PCM audio generated');

    // Convert to MP3
    const command = `ffmpeg -f s16le -ar 24000 -ac 1 -i "${pcmPath}" -codec:a libmp3lame -b:a 192k "${mp3Path}" -y`;
    await execAsync(command);
    await fs.unlink(pcmPath);

    console.log('✅ MP3 conversion successful');
    console.log(`📁 Test audio saved: ${mp3Path}`);

    return true;
  } catch (error) {
    console.error('❌ Lyra generation failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

async function testAudioComparison() {
  console.log('\n\n🔬 Test 3: Audio Quality Comparison');
  console.log('=' .repeat(50));

  const testPath = path.join(OUTPUT_DIR, 'test-lyra.mp3');

  try {
    // Check if test file exists
    await fs.access(testPath);

    const [generatedBuffer, referenceBuffer] = await Promise.all([
      fs.readFile(testPath),
      fs.readFile(REFERENCE_AUDIO)
    ]);

    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          parts: [
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
            {
              text: 'Compare these two meditation audio tracks. In 2-3 sentences: similarity score (0-100), what matches, what differs.'
            }
          ]
        }
      ]
    });

    const comparison = result.text;
    console.log('✅ Comparison successful');
    console.log('\nComparison:', comparison);

    return true;
  } catch (error) {
    console.error('❌ Comparison failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🧪 Lyra RealTime Integration Test Suite');
  console.log('=' .repeat(50));

  const results = {
    analysis: false,
    generation: false,
    comparison: false
  };

  // Test 1: Reference Analysis
  results.analysis = await testReferenceAnalysis();

  // Test 2: Lyra Generation
  if (results.analysis) {
    results.generation = await testLyraGeneration();
  } else {
    console.log('\n⏭️  Skipping generation test (analysis failed)');
  }

  // Test 3: Audio Comparison
  if (results.generation) {
    results.comparison = await testAudioComparison();
  } else {
    console.log('\n⏭️  Skipping comparison test (generation failed)');
  }

  // Summary
  console.log('\n\n📊 Test Results Summary');
  console.log('=' .repeat(50));
  console.log(`Reference Analysis: ${results.analysis ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Lyra Generation:    ${results.generation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Audio Comparison:   ${results.comparison ? '✅ PASS' : '❌ FAIL'}`);

  const allPassed = Object.values(results).every(r => r);

  if (allPassed) {
    console.log('\n🎉 All tests passed! Ready for full generation.');
    console.log('\nTo generate full meditation tracks, run:');
    console.log('  npm run generate');
  } else {
    console.log('\n⚠️  Some tests failed. Check errors above.');
    process.exit(1);
  }
}

main().catch(console.error);
