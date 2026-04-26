import { useState, useEffect } from 'react'
import { Music, Search, Save, Pencil, Trash2, X, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import * as spotifyService from '../api/spotifyService'

export default function SpotifySection() {
  const [tracks, setTracks] = useState([])
  const [artist, setArtist] = useState('')
  const [title, setTitle] = useState('')
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const load = async () => {
    try {
      const res = await spotifyService.getAll()
      setTracks(res.data)
    } catch { showMsg('Error al cargar tracks', true) }
  }

  useEffect(() => { load() }, [])

  const showMsg = (text, error = false) => {
    setMsg({ text, error })
    setTimeout(() => setMsg(null), 3000)
  }

  const handleSave = async () => {
    if (!artist.trim() || !title.trim()) return
    setLoading(true)
    try {
      if (editId) {
        await spotifyService.update(editId, artist, title)
        showMsg('Track actualizado correctamente')
      } else {
        await spotifyService.save(artist, title)
        showMsg('Track buscado y guardado')
      }
      setArtist(''); setTitle(''); setEditId(null)
      load()
    } catch { showMsg('Error al guardar', true) }
    setLoading(false)
  }

  const handleEdit = (t) => {
    setEditId(t.id); setArtist(t.artist); setTitle(t.title)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este track?')) return
    try {
      await spotifyService.remove(id)
      showMsg('Track eliminado')
      load()
    } catch { showMsg('Error al eliminar', true) }
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-icon spotify"><Music size={20} color="#1db954" /></div>
        <h2>Spotify Tracks</h2>
        <span className="count-badge">{tracks.length} registros</span>
      </div>

      <div className="form-card">
        <h3>{editId ? 'Editar Track' : 'Buscar y Guardar'}</h3>
        <div className="form-row">
          <input placeholder="Artista (ej: Bad Bunny)" value={artist} onChange={e => setArtist(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()} />
          <input placeholder="Título de la canción" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()} />
          <button className="btn btn-primary-spotify" onClick={handleSave} disabled={loading || !artist.trim() || !title.trim()}>
            {loading ? <><span className="spinner" />Buscando...</> : editId ? <><Save size={15} />Actualizar</> : <><Search size={15} />Buscar</>}
          </button>
          {editId && <button className="btn btn-secondary" onClick={() => { setEditId(null); setArtist(''); setTitle('') }}><X size={15} />Cancelar</button>}
        </div>
      </div>

      {msg && (
        <div className={`toast ${msg.error ? 'error' : ''}`}>
          {msg.error ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {msg.text}
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>#</th><th>Artista / Título</th><th>Álbum</th><th>Letra</th><th>Fecha</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {tracks.length === 0 ? (
              <tr><td colSpan="6">
                <div className="empty-state">
                  <Music size={40} color="#333" />
                  <p>No hay tracks guardados. Busca uno arriba.</p>
                </div>
              </td></tr>
            ) : tracks.map(t => (
              <>
              <tr key={t.id}>
                <td><span className="badge">{t.id}</span></td>
                <td>
                  <div className="track-title">{t.title || '—'}</div>
                  <div className="track-sub">{t.artist}</div>
                </td>
                <td><span className="badge">{t.album || '—'}</span></td>
                <td style={{ maxWidth: '200px', cursor: t.lyrics ? 'pointer' : 'default' }}
                    onClick={() => t.lyrics && setExpandedId(expandedId === t.id ? null : t.id)}>
                  {t.lyrics ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div className="lyrics-preview">{t.lyrics.substring(0, 60)}...</div>
                      {expandedId === t.id ? <ChevronUp size={14} color="#666" /> : <ChevronDown size={14} color="#666" />}
                    </div>
                  ) : <span style={{ color: '#444' }}>—</span>}
                </td>
                <td style={{ color: '#555', fontSize: '0.8rem' }}>
                  {t.creationDate ? new Date(t.creationDate).toLocaleDateString() : '—'}
                </td>
                <td>
                  <div className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(t)}><Pencil size={13} /> Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(t.id)}><Trash2 size={13} /> Eliminar</button>
                  </div>
                </td>
              </tr>
              {expandedId === t.id && t.lyrics && (
                <tr key={`lyrics-${t.id}`}>
                  <td colSpan="6" style={{ padding: '0 16px 16px 16px', background: '#0d0d0d' }}>
                    <div className="lyrics-full">
                      <div className="lyrics-full-header">
                        <Music size={14} color="#1db954" /> Letra completa — {t.title}
                      </div>
                      <pre className="lyrics-text">{t.lyrics}</pre>
                    </div>
                  </td>
                </tr>
              )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
