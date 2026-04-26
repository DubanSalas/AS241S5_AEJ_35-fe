import { youtubeApi } from './config'

export const getAll = () => youtubeApi.get('')
export const save = (query) => youtubeApi.post('/save', { query })
export const update = (id, query) => youtubeApi.put(`/update/${id}`, { query })
export const remove = (id) => youtubeApi.delete(`/${id}`)
