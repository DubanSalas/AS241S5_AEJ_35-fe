import { spotifyApi } from './config'

export const getAll = () => spotifyApi.get('')
export const save = (artist, title) => spotifyApi.post('/save', { artist, title })
export const update = (id, artist, title) => spotifyApi.put(`/update/${id}`, { artist, title })
export const remove = (id) => spotifyApi.delete(`/${id}`)
