import { useState, useEffect } from 'react'
import { PlayCircle, Search, Save, Pencil, Trash2, X, AlertCircle, CheckCircle } from 'lucide-react'
import * as youtubeService from '../api/youtubeService'

function VideoModal({ video, onClose }) {
  if (!video) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{video.title}</div>
            <div className="modal-sub">{video.channel}</div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        {video.videoId ? (
          <iframe
            className="modal-iframe"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="modal-no-video">
            <PlayCircle size={48} color="#333" />
            <p>No hay video disponible para este registro</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function YoutubeSection() {
  const [videos, setVideos] = useState([])
  const [query, setQuery] = useState('')
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const load = async () => {
    try {
      const res = await youtubeService.getAll()
      setVideos(res.data)
    } catch { showMsg('Error al cargar videos', true) }
  }

  useEffect(() => { load() }, [])

  const showMsg = (text, error = false) => {
    setMsg({ text, error })
    setTimeout(() => setMsg(null), 3000)
  }

  const handleSave = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      if (editId) {
        await youtubeService.update(editId, query)
        showMsg('Video actualizado correctamente')
      } else {
        await youtubeService.save(query)
        showMsg('Videos buscados y guardados')
      }
      setQuery(''); setEditId(null)
      load()
    } catch { showMsg('Error al guardar', true) }
    setLoading(false)
  }

  const handleEdit = (v) => {
    setEditId(v.id); setQuery(v.query)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este video?')) return
    try {
      await youtubeService.remove(id)
      showMsg('Video eliminado')
      load()
    } catch { showMsg('Error al eliminar', true) }
  }

  const getThumbnail = (v) => {
    if (v.thumbnailUrl) return v.thumbnailUrl
    if (v.videoId) return `https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`
    return null
  }

  return (
    <div>
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />

      <div className="section-header">
        <div className="section-icon youtube"><PlayCircle size={20} color="#ff0000" /></div>
        <h2>YouTube Videos</h2>
        <span className="count-badge">{videos.length} registros</span>
      </div>

      <div className="form-card">
        <h3>{editId ? 'Editar Búsqueda' : 'Buscar y Guardar'}</h3>
        <div className="form-row">
          <input className="youtube" placeholder="Búsqueda (ej: Bad Bunny, Shakira...)" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()} />
          <button className="btn btn-primary-youtube" onClick={handleSave} disabled={loading || !query.trim()}>
            {loading ? <><span className="spinner" />Buscando...</> : editId ? <><Save size={15} />Actualizar</> : <><Search size={15} />Buscar</>}
          </button>
          {editId && <button className="btn btn-secondary" onClick={() => { setEditId(null); setQuery('') }}><X size={15} />Cancelar</button>}
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
            <tr><th>#</th><th>Miniatura</th><th>Título / Canal</th><th>Query</th><th>Fecha</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {videos.length === 0 ? (
              <tr><td colSpan="6">
                <div className="empty-state">
                  <PlayCircle size={40} color="#333" />
                  <p>No hay videos guardados. Busca uno arriba.</p>
                </div>
              </td></tr>
            ) : videos.map(v => (
              <tr key={v.id}>
                <td><span className="badge">{v.id}</span></td>
                <td style={{ cursor: 'pointer' }} onClick={() => setSelectedVideo(v)}>
                  <div className="thumb-container">
                    {getThumbnail(v)
                      ? <img className="thumb" src={getThumbnail(v)} alt={v.title} />
                      : <div className="thumb-placeholder"><PlayCircle size={18} color="#333" /></div>}
                    <div className="thumb-play-overlay"><PlayCircle size={20} color="#fff" /></div>
                  </div>
                </td>
                <td>
                  <div className="track-title video-link" onClick={() => setSelectedVideo(v)}>{v.title || '—'}</div>
                  <div className="track-sub">{v.channel || '—'}</div>
                </td>
                <td><span className="badge">{v.query}</span></td>
                <td style={{ color: '#555', fontSize: '0.8rem' }}>
                  {v.creationDate ? new Date(v.creationDate).toLocaleDateString() : '—'}
                </td>
                <td>
                  <div className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(v)}><Pencil size={13} /> Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(v.id)}><Trash2 size={13} /> Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
