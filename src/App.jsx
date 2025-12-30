import { useState, useRef, useEffect } from 'react'
import './App.css'

const audioFiles = [
  {
    id: 1,
    title: 'El Templo de Agua de María Magdalena',
    artist: 'Eva Julián',
    file: '/audio/BA79-El-Templo-de-Agua-de-Maria-Magdalena.mp3',
    duration: '58:26',
    color: '#4A90A4'
  },
  {
    id: 2,
    title: 'Cañón del Río Lobos',
    artist: 'Eva Julián',
    file: '/audio/Canon-Rio-Lobos.mp3',
    duration: '36:12',
    color: '#7B8B6F'
  }
]

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function App() {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const playTrack = (index) => {
    if (index === currentTrack && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      setCurrentTrack(index)
      setIsLoading(true)
      setTimeout(() => {
        audioRef.current.play()
        setIsPlaying(true)
      }, 100)
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    setCurrentTime(audio.currentTime)
    setProgress((audio.currentTime / audio.duration) * 100)
  }

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration)
    setIsLoading(false)
  }

  const handleProgressClick = (e) => {
    const bar = e.currentTarget
    const rect = bar.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = percent * audioRef.current.duration
  }

  const nextTrack = () => {
    const next = (currentTrack + 1) % audioFiles.length
    setCurrentTrack(next)
    setIsLoading(true)
    setTimeout(() => {
      audioRef.current.play()
      setIsPlaying(true)
    }, 100)
  }

  const prevTrack = () => {
    const prev = currentTrack === 0 ? audioFiles.length - 1 : currentTrack - 1
    setCurrentTrack(prev)
    setIsLoading(true)
    setTimeout(() => {
      audioRef.current.play()
      setIsPlaying(true)
    }, 100)
  }

  const track = audioFiles[currentTrack]

  return (
    <div className="app">
      <div className="background-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <header className="header">
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="currentColor" className="logo-icon">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          <span>Sonido y Vida</span>
        </div>
        <p className="subtitle">Audios de María Eulalia</p>
      </header>

      <main className="main-content">
        <div className="now-playing">
          <div className="album-art" style={{ '--accent': track.color }}>
            <div className="art-inner">
              <div className={`sound-waves ${isPlaying ? 'playing' : ''}`}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="wave" style={{ animationDelay: `${i * 0.15}s` }}></div>
                ))}
              </div>
            </div>
          </div>

          <div className="track-details">
            <h1 className="track-title">{track.title}</h1>
            <p className="track-artist">{track.artist}</p>
          </div>

          <div className="progress-section">
            <div className="progress-bar" onClick={handleProgressClick}>
              <div className="progress-bg"></div>
              <div className="progress-fill" style={{ width: `${progress}%`, '--accent': track.color }}></div>
              <div className="progress-handle" style={{ left: `${progress}%` }}></div>
            </div>
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="controls">
            <button className="control-btn" onClick={prevTrack} title="Anterior">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            <button className="control-btn play-btn" onClick={togglePlay} style={{ '--accent': track.color }}>
              {isLoading ? (
                <div className="loader"></div>
              ) : isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            <button className="control-btn" onClick={nextTrack} title="Siguiente">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>

          <div className="volume-section">
            <svg viewBox="0 0 24 24" fill="currentColor" className="volume-icon">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
              style={{ '--value': `${volume * 100}%`, '--accent': track.color }}
            />
          </div>
        </div>

        <div className="playlist">
          <h2 className="playlist-title">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z"/>
            </svg>
            Meditaciones
          </h2>
          <div className="track-list">
            {audioFiles.map((item, index) => (
              <div
                key={item.id}
                className={`track-item ${index === currentTrack ? 'active' : ''}`}
                onClick={() => playTrack(index)}
                style={{ '--accent': item.color }}
              >
                <div className="track-item-art">
                  {index === currentTrack && isPlaying ? (
                    <div className="mini-waves">
                      <span></span><span></span><span></span>
                    </div>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </div>
                <div className="track-item-info">
                  <span className="track-item-title">{item.title}</span>
                  <span className="track-item-artist">{item.artist}</span>
                </div>
                <span className="track-item-duration">{item.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <audio
        ref={audioRef}
        src={track.file}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
        onCanPlay={() => setIsLoading(false)}
      />

      <footer className="footer">
        <p>Eva Julián - Sonido y Vida</p>
      </footer>
    </div>
  )
}

export default App
