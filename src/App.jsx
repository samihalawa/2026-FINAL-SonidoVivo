import { useState, useRef, useEffect } from 'react'
import './App.css'

const audioFiles = [
  // Nature Sounds - Water
  { id: 1, title: 'El Templo de Agua Sagrada', artist: 'María Eulalia', file: '/audio/BA79-El-Templo-de-Agua-de-Maria-Magdalena.mp3', duration: '58:26', color: '#4A90A4', category: 'water' },
  { id: 2, title: 'Río del Cañón Místico', artist: 'María Eulalia', file: '/audio/Canon-Rio-Lobos.mp3', duration: '1:24:28', color: '#5DB8C4', category: 'water' },
  { id: 3, title: 'Cascada de Serenidad', artist: 'María Eulalia', file: '/audio/Agua-Relajante-Meditación.mp3', duration: '3:52', color: '#6BA4B8', category: 'water' },
  { id: 4, title: 'Arroyo de Montaña', artist: 'María Eulalia', file: '/audio/stream-mountain.mp3', duration: '45:00', color: '#4B9CD3', category: 'water' },
  { id: 5, title: 'Lluvia en el Bosque', artist: 'María Eulalia', file: '/audio/rain-forest.mp3', duration: '60:00', color: '#5A8F9B', category: 'water' },
  { id: 6, title: 'Olas del Océano', artist: 'María Eulalia', file: '/audio/ocean-waves.mp3', duration: '55:00', color: '#3D7A99', category: 'water' },
  { id: 7, title: 'Tormenta Suave', artist: 'María Eulalia', file: '/audio/gentle-storm.mp3', duration: '40:00', color: '#6E8B9E', category: 'water' },
  { id: 8, title: 'Gotas de Rocío', artist: 'María Eulalia', file: '/audio/morning-dew.mp3', duration: '30:00', color: '#7FCDCD', category: 'water' },

  // Nature Sounds - Forest & Birds
  { id: 9, title: 'Amanecer en el Bosque', artist: 'María Eulalia', file: '/audio/forest-dawn.mp3', duration: '50:00', color: '#7B8B6F', category: 'forest' },
  { id: 10, title: 'Cantos de Pájaros', artist: 'María Eulalia', file: '/audio/bird-songs.mp3', duration: '45:00', color: '#8BA490', category: 'forest' },
  { id: 11, title: 'Noche en la Selva', artist: 'María Eulalia', file: '/audio/jungle-night.mp3', duration: '55:00', color: '#5A6B4A', category: 'forest' },
  { id: 12, title: 'Viento entre los Árboles', artist: 'María Eulalia', file: '/audio/wind-trees.mp3', duration: '40:00', color: '#6B8E6B', category: 'forest' },
  { id: 13, title: 'Grillos Nocturnos', artist: 'María Eulalia', file: '/audio/night-crickets.mp3', duration: '60:00', color: '#4A5D4A', category: 'forest' },
  { id: 14, title: 'Búho del Bosque', artist: 'María Eulalia', file: '/audio/owl-forest.mp3', duration: '35:00', color: '#5D6B5D', category: 'forest' },
  { id: 15, title: 'Hojas al Viento', artist: 'María Eulalia', file: '/audio/leaves-wind.mp3', duration: '45:00', color: '#7A9B7A', category: 'forest' },

  // Meditation & Healing
  { id: 16, title: 'Templo Interior', artist: 'María Eulalia', file: '/audio/Templo_Maria_Magdalena_MP3.mp3', duration: '58:26', color: '#A47B8B', category: 'meditation' },
  { id: 17, title: 'Sanación Profunda', artist: 'María Eulalia', file: '/audio/Cañon_Rio_Lobos_MP3.mp3', duration: '1:24:28', color: '#9B7A8B', category: 'meditation' },
  { id: 18, title: 'Cuencos Tibetanos', artist: 'María Eulalia', file: '/audio/tibetan-bowls.mp3', duration: '30:00', color: '#D4A574', category: 'meditation' },
  { id: 19, title: 'Campanas de Sanación', artist: 'María Eulalia', file: '/audio/healing-bells.mp3', duration: '25:00', color: '#C9A55C', category: 'meditation' },
  { id: 20, title: 'Energía Positiva', artist: 'María Eulalia', file: '/audio/30-Min-Positive-Energy-Meditation.mp3', duration: '30:02', color: '#B8956B', category: 'meditation' },
  { id: 21, title: 'Flauta Meditativa', artist: 'María Eulalia', file: '/audio/30-Min-Flute-Meditation.mp3', duration: '30:40', color: '#8FAADC', category: 'meditation' },
  { id: 22, title: 'Chakra Armonía', artist: 'María Eulalia', file: '/audio/chakra-harmony.mp3', duration: '45:00', color: '#9F8FDC', category: 'meditation' },
  { id: 23, title: 'Ondas Cerebrales Alfa', artist: 'María Eulalia', file: '/audio/alpha-waves.mp3', duration: '60:00', color: '#7B9FDC', category: 'meditation' },

  // Sleep & Relaxation
  { id: 24, title: 'Noche Estrellada', artist: 'María Eulalia', file: '/audio/starry-night.mp3', duration: '8:00:00', color: '#2C3E50', category: 'sleep' },
  { id: 25, title: 'Sueño Profundo', artist: 'María Eulalia', file: '/audio/deep-sleep.mp3', duration: '8:00:00', color: '#34495E', category: 'sleep' },
  { id: 26, title: 'Luna Llena', artist: 'María Eulalia', file: '/audio/full-moon.mp3', duration: '6:00:00', color: '#5D6D7E', category: 'sleep' },
  { id: 27, title: 'Ruido Blanco Suave', artist: 'María Eulalia', file: '/audio/white-noise.mp3', duration: '8:00:00', color: '#7F8C8D', category: 'sleep' },
  { id: 28, title: 'Ventilador Nocturno', artist: 'María Eulalia', file: '/audio/night-fan.mp3', duration: '8:00:00', color: '#95A5A6', category: 'sleep' },

  // Ambient & Atmosphere
  { id: 29, title: 'Meditación Profunda', artist: 'María Eulalia', file: '/audio/Positive-Energy-Slow.mp3', duration: '33:22', color: '#6B9B7F', category: 'ambient' },
  { id: 30, title: 'Ambiente Celestial', artist: 'María Eulalia', file: '/audio/Meditation-Ambient-Reverb.mp3', duration: '10:01', color: '#7AA8C7', category: 'ambient' },
  { id: 31, title: 'Flauta Activa', artist: 'María Eulalia', file: '/audio/Flute-Active-Meditation.mp3', duration: '27:52', color: '#96A87C', category: 'ambient' },
  { id: 32, title: 'Música Libre', artist: 'María Eulalia', file: '/audio/Música-Meditación-Libre.mp3', duration: '10:00', color: '#8B9F7C', category: 'ambient' },
  { id: 33, title: 'Spa Relajante', artist: 'María Eulalia', file: '/audio/spa-relaxing.mp3', duration: '60:00', color: '#A8D5BA', category: 'ambient' },
  { id: 34, title: 'Piano Tranquilo', artist: 'María Eulalia', file: '/audio/calm-piano.mp3', duration: '45:00', color: '#D4B5A5', category: 'ambient' },
  { id: 35, title: 'Jardín Zen', artist: 'María Eulalia', file: '/audio/zen-garden.mp3', duration: '50:00', color: '#9BB5C7', category: 'ambient' },

  // Focus & Study
  { id: 36, title: 'Concentración Total', artist: 'María Eulalia', file: '/audio/total-focus.mp3', duration: '120:00', color: '#5DADE2', category: 'focus' },
  { id: 37, title: 'Café Tranquilo', artist: 'María Eulalia', file: '/audio/quiet-cafe.mp3', duration: '90:00', color: '#AF7AC5', category: 'focus' },
  { id: 38, title: 'Biblioteca Silenciosa', artist: 'María Eulalia', file: '/audio/silent-library.mp3', duration: '60:00', color: '#85929E', category: 'focus' },
  { id: 39, title: 'Productividad', artist: 'María Eulalia', file: '/audio/productivity.mp3', duration: '120:00', color: '#5499C7', category: 'focus' },
  { id: 40, title: 'Mente Clara', artist: 'María Eulalia', file: '/audio/clear-mind.mp3', duration: '45:00', color: '#48C9B0', category: 'focus' },
  { id: 41, title: 'Estudio Profundo', artist: 'María Eulalia', file: '/audio/deep-study.mp3', duration: '90:00', color: '#5D6D7E', category: 'focus' }
]

const categories = [
  { id: 'all', name: 'Todos', icon: '✨' },
  { id: 'water', name: 'Agua', icon: '💧' },
  { id: 'forest', name: 'Bosque', icon: '🌲' },
  { id: 'meditation', name: 'Meditación', icon: '🧘' },
  { id: 'sleep', name: 'Dormir', icon: '🌙' },
  { id: 'ambient', name: 'Ambiente', icon: '🎵' },
  { id: 'focus', name: 'Enfoque', icon: '🎯' }
]

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00'
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
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
  const [activeTab, setActiveTab] = useState('home')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showMiniPlayer, setShowMiniPlayer] = useState(false)
  const audioRef = useRef(null)
  const mainRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current && activeTab === 'home') {
        setShowMiniPlayer(mainRef.current.scrollTop > 300)
      }
    }
    const mainEl = mainRef.current
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll)
      return () => mainEl.removeEventListener('scroll', handleScroll)
    }
  }, [activeTab])

  const playTrack = (index) => {
    if (index === currentTrack && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      setCurrentTrack(index)
      setIsLoading(true)
      setTimeout(() => {
        audioRef.current.play().catch(() => setIsLoading(false))
        setIsPlaying(true)
      }, 100)
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio && audio.duration) {
      setCurrentTime(audio.currentTime)
      setProgress((audio.currentTime / audio.duration) * 100)
    }
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
    const filteredTracks = getFilteredTracks()
    const currentIndex = filteredTracks.findIndex(t => t.id === audioFiles[currentTrack].id)
    const nextIndex = (currentIndex + 1) % filteredTracks.length
    const globalIndex = audioFiles.findIndex(t => t.id === filteredTracks[nextIndex].id)
    setCurrentTrack(globalIndex)
    setIsLoading(true)
    setTimeout(() => {
      audioRef.current.play().catch(() => setIsLoading(false))
      setIsPlaying(true)
    }, 100)
  }

  const prevTrack = () => {
    const filteredTracks = getFilteredTracks()
    const currentIndex = filteredTracks.findIndex(t => t.id === audioFiles[currentTrack].id)
    const prevIndex = currentIndex === 0 ? filteredTracks.length - 1 : currentIndex - 1
    const globalIndex = audioFiles.findIndex(t => t.id === filteredTracks[prevIndex].id)
    setCurrentTrack(globalIndex)
    setIsLoading(true)
    setTimeout(() => {
      audioRef.current.play().catch(() => setIsLoading(false))
      setIsPlaying(true)
    }, 100)
  }

  const getFilteredTracks = () => {
    if (selectedCategory === 'all') return audioFiles
    return audioFiles.filter(t => t.category === selectedCategory)
  }

  const track = audioFiles[currentTrack]

  const renderHome = () => (
    <div className="home-content">
      {/* Hero Player */}
      <div className="hero-player">
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
          <button className="control-btn" onClick={prevTrack} aria-label="Anterior">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          <button className="control-btn play-btn" onClick={togglePlay} style={{ '--accent': track.color }} aria-label={isPlaying ? 'Pausar' : 'Reproducir'}>
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

          <button className="control-btn" onClick={nextTrack} aria-label="Siguiente">
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
            aria-label="Volumen"
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span>Desliza para explorar</span>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>

      {/* Quick Categories */}
      <div className="quick-section">
        <h2 className="section-title">Categorías</h2>
        <div className="category-chips">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="chip-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Tracks */}
      <div className="featured-section">
        <h2 className="section-title">
          {selectedCategory === 'all' ? 'Todos los Sonidos' : categories.find(c => c.id === selectedCategory)?.name}
          <span className="track-count">{getFilteredTracks().length} pistas</span>
        </h2>
        <div className="track-grid">
          {getFilteredTracks().map((item) => {
            const index = audioFiles.findIndex(t => t.id === item.id)
            return (
              <div
                key={item.id}
                className={`track-card ${index === currentTrack ? 'active' : ''}`}
                onClick={() => playTrack(index)}
                style={{ '--accent': item.color }}
              >
                <div className="track-card-art">
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
                <div className="track-card-info">
                  <span className="track-card-title">{item.title}</span>
                  <span className="track-card-duration">{item.duration}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderDiscover = () => (
    <div className="discover-content">
      <h1 className="page-title">Descubre</h1>
      <p className="page-subtitle">Explora nuestra colección de sonidos naturales</p>

      {/* Benefits Section */}
      <div className="info-section">
        <h2 className="section-title">Beneficios de los Sonidos Naturales</h2>

        <div className="benefit-cards">
          <div className="benefit-card">
            <div className="benefit-icon">😴</div>
            <h3>Mejor Sueño</h3>
            <p>Los sonidos naturales ayudan a reducir el tiempo que tardas en dormirte y mejoran la calidad del descanso nocturno.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">🧘</div>
            <h3>Reduce el Estrés</h3>
            <p>Escuchar sonidos de la naturaleza disminuye los niveles de cortisol, la hormona del estrés, promoviendo la relajación.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">🎯</div>
            <h3>Mayor Concentración</h3>
            <p>El ruido ambiental natural mejora el enfoque y la productividad al bloquear distracciones molestas.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">💆</div>
            <h3>Calma la Ansiedad</h3>
            <p>Los sonidos suaves de agua o bosque activan el sistema nervioso parasimpático, reduciendo la ansiedad.</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="info-section">
        <h2 className="section-title">Cómo Funciona</h2>

        <div className="steps-list">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Elige tu Ambiente</h3>
              <p>Selecciona entre agua, bosque, meditación o sonidos para dormir según tu necesidad.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Ajusta el Volumen</h3>
              <p>Encuentra el nivel perfecto que te permita relajarte sin distracciones.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Disfruta y Relájate</h3>
              <p>Deja que los sonidos naturales te transporten a un estado de calma profunda.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Science Section */}
      <div className="info-section science-section">
        <h2 className="section-title">La Ciencia del Sonido</h2>
        <div className="science-content">
          <p>Estudios científicos han demostrado que los sonidos de la naturaleza tienen un efecto profundo en nuestro cerebro. Investigadores de la Universidad de Sussex encontraron que los sonidos naturales activan el sistema nervioso parasimpático, responsable de la respuesta de "descanso y digestión".</p>
          <p>El agua fluyendo, el canto de los pájaros y el susurro del viento contienen frecuencias que nuestro cerebro reconoce como seguras, reduciendo la respuesta de alerta y permitiendo una relajación más profunda.</p>
        </div>
      </div>

      {/* Tips */}
      <div className="info-section tips-section">
        <h2 className="section-title">Consejos para Mejor Resultado</h2>
        <ul className="tips-list">
          <li>Usa auriculares para una experiencia inmersiva</li>
          <li>Crea una rutina nocturna con los mismos sonidos</li>
          <li>Combina con técnicas de respiración profunda</li>
          <li>Mantén el volumen a un nivel suave y constante</li>
          <li>Prueba diferentes categorías hasta encontrar tu favorita</li>
        </ul>
      </div>
    </div>
  )

  const renderLibrary = () => (
    <div className="library-content">
      <h1 className="page-title">Biblioteca</h1>
      <p className="page-subtitle">{audioFiles.length} sonidos disponibles</p>

      {/* Categories Filter */}
      <div className="library-categories">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`lib-category ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="lib-cat-icon">{cat.icon}</span>
            <span className="lib-cat-name">{cat.name}</span>
            <span className="lib-cat-count">
              {cat.id === 'all' ? audioFiles.length : audioFiles.filter(t => t.category === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Track List */}
      <div className="library-tracks">
        {getFilteredTracks().map((item) => {
          const index = audioFiles.findIndex(t => t.id === item.id)
          return (
            <div
              key={item.id}
              className={`library-track ${index === currentTrack ? 'active' : ''}`}
              onClick={() => playTrack(index)}
              style={{ '--accent': item.color }}
            >
              <div className="lib-track-art">
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
              <div className="lib-track-info">
                <span className="lib-track-title">{item.title}</span>
                <span className="lib-track-artist">{item.artist}</span>
              </div>
              <span className="lib-track-duration">{item.duration}</span>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderAbout = () => (
    <div className="about-content">
      <h1 className="page-title">Sonido y Vida</h1>
      <p className="page-subtitle">Tu compañero de bienestar auditivo</p>

      <div className="about-hero">
        <div className="about-logo">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
      </div>

      <div className="about-section">
        <h2>Nuestra Misión</h2>
        <p>Sonido y Vida nace del deseo de llevar la paz y serenidad de la naturaleza a tu vida diaria. Creemos que todos merecen un momento de calma en medio del ajetreado mundo moderno.</p>
      </div>

      <div className="about-section">
        <h2>Contenido Curado</h2>
        <p>Cada sonido en nuestra colección ha sido cuidadosamente seleccionado y procesado por María Eulalia para garantizar la máxima calidad auditiva y efectividad terapéutica.</p>
      </div>

      <div className="about-section">
        <h2>Lo que Ofrecemos</h2>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">🌊</span>
            <span>Sonidos de Agua</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🌲</span>
            <span>Bosques y Naturaleza</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🧘</span>
            <span>Meditación Guiada</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🌙</span>
            <span>Sonidos para Dormir</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎵</span>
            <span>Música Ambiental</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span>Enfoque y Estudio</span>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Uso Recomendado</h2>
        <ul className="usage-list">
          <li>Antes de dormir para conciliar el sueño</li>
          <li>Durante el trabajo para mejor concentración</li>
          <li>En sesiones de meditación y yoga</li>
          <li>Para reducir el estrés y la ansiedad</li>
          <li>Como fondo durante el estudio</li>
        </ul>
      </div>

      <div className="about-footer">
        <p className="creator">Creado con amor por María Eulalia</p>
        <p className="version">Versión 2.0</p>
      </div>
    </div>
  )

  return (
    <div className="app">
      <div className="background-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Status Bar Safe Area */}
      <div className="status-bar-spacer"></div>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="currentColor" className="logo-icon">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          <span>Sonido y Vida</span>
        </div>
      </header>

      {/* Mini Player (shows when scrolled) */}
      {showMiniPlayer && activeTab === 'home' && (
        <div className="mini-player" style={{ '--accent': track.color }}>
          <div className="mini-player-info">
            <div className="mini-player-art">
              {isPlaying && (
                <div className="mini-waves">
                  <span></span><span></span><span></span>
                </div>
              )}
            </div>
            <div className="mini-player-text">
              <span className="mini-player-title">{track.title}</span>
              <span className="mini-player-artist">{track.artist}</span>
            </div>
          </div>
          <button className="mini-player-btn" onClick={togglePlay}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content" ref={mainRef}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'discover' && renderDiscover()}
        {activeTab === 'library' && renderLibrary()}
        {activeTab === 'about' && renderAbout()}
      </main>

      {/* Tab Bar */}
      <nav className="tab-bar">
        <button
          className={`tab-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>Inicio</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"/>
          </svg>
          <span>Descubre</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/>
          </svg>
          <span>Biblioteca</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <span>Info</span>
        </button>
      </nav>

      {/* Home Indicator Safe Area */}
      <div className="home-indicator-spacer"></div>

      <audio
        ref={audioRef}
        src={track.file}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
        onCanPlay={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  )
}

export default App
