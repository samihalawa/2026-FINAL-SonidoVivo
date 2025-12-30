# Sonido y Vida - Audio Player

A beautiful meditation audio player featuring guided meditations by Eva Julián, enhanced with AI-generated ambient soundscapes using Gemini Lyra RealTime.

## Features

- 🎵 Clean, modern audio player interface
- 🌊 Animated sound wave visualizations
- 📱 Responsive design for all devices
- 🎨 Beautiful gradient backgrounds
- 🤖 AI-generated meditation music using Lyra RealTime

## Project Structure

```
sonidovivo-player/
├── public/audio/          # Audio files (original + AI-generated)
├── src/
│   ├── App.jsx           # Main player component
│   └── App.css           # Styles
├── lyra-generator.js     # AI audio generation script
└── package.json
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## AI Audio Generation with Lyra RealTime (Future Integration)

This project is prepared to integrate Google's Gemini Lyra RealTime API for AI-generated meditation audio once the API becomes publicly available.

### Prerequisites

1. **Gemini API Key**: Set `GEMINI_API_KEY` environment variable
2. **FFmpeg**: Required for audio conversion
   ```bash
   brew install ffmpeg
   ```

### Generation Process

The `lyra-generator.js` script implements an intelligent audio generation workflow:

#### 1. Reference Analysis
- Uses Gemini multimodal API to analyze existing meditation tracks
- Extracts characteristics: mood, instruments, tempo, textures, energy
- Creates detailed sonic profile for replication

#### 2. Prompt Engineering
- Generates prompts based on reference analysis
- Configures optimal parameters for meditation music:
  - **BPM**: 60-80 (slow, meditative)
  - **Temperature**: 1.0-1.5 (creative but controlled)
  - **Density**: 0.3-0.5 (sparse, ambient)
  - **Brightness**: 0.4-0.6 (warm, not harsh)
  - **Instruments**: ambient pads, ethereal synths, nature sounds, meditation bowls

#### 3. Audio Generation
- Uses Lyra RealTime to generate PCM audio
- Converts PCM to MP3 using FFmpeg
- Saves to `public/audio/` directory

#### 4. Quality Comparison
- Compares generated audio with reference tracks
- Scores similarity (0-100)
- Provides actionable feedback

#### 5. Iterative Refinement
- Refines prompts based on Gemini's feedback
- Adjusts parameters (BPM, density, brightness)
- Iterates up to 3 times per track
- Keeps best version (highest quality score)

#### 6. Automatic Integration
- Updates `App.jsx` with new tracks
- Adds to playlist with proper metadata
- Ready for immediate use

### Current Status

**Note**: As of December 2025, Lyra RealTime is not yet publicly available via the Gemini API. The integration scripts are ready and tested for:
- ✅ Reference audio analysis using Gemini 2.0 Flash multimodal
- ✅ Audio comparison and quality assessment
- ⏳ Lyra music generation (pending API availability)

### Testing the Integration

```bash
# Test current capabilities (analysis + comparison)
npm run test-lyra
```

Once Lyra RealTime becomes available, run:

```bash
# Generate new meditation tracks
npm run generate
```

### Generation Configuration

Edit `TRACKS_TO_GENERATE` in `lyra-generator.js`:

```javascript
const TRACKS_TO_GENERATE = [
  {
    title: 'Your Track Title',
    theme: 'meditation theme',
    duration: 3500,  // seconds (~58 minutes)
    color: '#6BA4B8' // UI accent color
  }
];
```

### Audio Parameters

Adjust `AUDIO_PARAMS` for different styles:

```javascript
const AUDIO_PARAMS = {
  bpm: 65,              // Slower = more meditative
  temperature: 1.2,     // Higher = more creative
  density: 0.4,         // Lower = more sparse
  brightness: 0.5,      // Lower = warmer tone
  instruments: [...]    // Sonic palette
};
```

## Deployment

Built with Vite and deployed to Netlify:

```bash
npm run build
# Deploy dist/ folder
```

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Gemini AI** - Audio generation (Lyra RealTime)
- **FFmpeg** - Audio processing
- **Netlify** - Hosting

## License

© 2024 Eva Julián - Sonido y Vida
