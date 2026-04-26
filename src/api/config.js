import axios from 'axios'

// Si hay variable de entorno la usa, si no intenta detectar Codespaces, si no usa localhost
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL

  // En Codespaces la URL del frontend es algo como: https://xxx-5173.app.github.dev
  // El backend corre en el puerto 8085 del mismo Codespace
  const host = window.location.hostname
  if (host.includes('.app.github.dev')) {
    // Reemplaza el puerto 5173 por 8085
    return `https://${host.replace('-5173.', '-8085.')}`
  }

  return 'http://localhost:8080'
}

const BASE_URL = getBaseUrl()

export const spotifyApi = axios.create({ baseURL: `${BASE_URL}/v1/api/spotify` })
export const youtubeApi = axios.create({ baseURL: `${BASE_URL}/v1/api/youtube` })
