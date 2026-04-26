import { useState } from 'react'
import { PlayCircle, Music } from 'lucide-react'
import SpotifySection from './components/SpotifySection'
import YoutubeSection from './components/YoutubeSection'
import './index.css'

export default function App() {
  const [tab, setTab] = useState('spotify')

  return (
    <div className="app">
      <header>
        <div className="header-inner">
          <div className="logo">
            <Music size={22} color="#1db954" />
            Music<span>CRUD</span>
          </div>
          <nav>
            <button
              className={`tab-btn spotify ${tab === 'spotify' ? 'active' : ''}`}
              onClick={() => setTab('spotify')}
            >
              <Music size={15} /> Spotify
            </button>
            <button
              className={`tab-btn youtube ${tab === 'youtube' ? 'active' : ''}`}
              onClick={() => setTab('youtube')}
            >
              <PlayCircle size={15} /> YouTube
            </button>
          </nav>
        </div>
      </header>
      <main>
        {tab === 'spotify' ? <SpotifySection /> : <YoutubeSection />}
      </main>
    </div>
  )
}
