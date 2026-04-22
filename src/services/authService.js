import api from './api'

export const authService = {
  async register(payload) {
    const { data } = await api.post('/register', payload)
    return data
  },

  async login(payload) {
    const { data } = await api.post('/login', payload)
    return data
  },

  async getMe() {
    const { data } = await api.get('/me')
    return data
  },
}
