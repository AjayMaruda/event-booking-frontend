import api from './api'

export const eventService = {
  async getAll(params = {}) {
    const { data } = await api.get('/events', { params })
    return data
  },

  async getOne(id) {
    const { data } = await api.get(`/events/${id}`)
    return data
  },

  async create(payload) {
    const { data } = await api.post('/events', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/events/${id}`, payload)
    return data
  },

  async remove(id) {
    const { data } = await api.delete(`/events/${id}`)
    return data
  },
}
