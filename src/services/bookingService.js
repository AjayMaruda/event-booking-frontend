import api from './api'

export const bookingService = {
  async book(eventId) {
    const { data } = await api.post(`/bookings/${eventId}`)
    return data
  },

  async myBookings() {
    const { data } = await api.get('/bookings/my')
    return data
  },

  async cancel(bookingId) {
    const { data } = await api.patch(`/bookings/${bookingId}/cancel`)
    return data
  },

  async exportCSV() {
    const response = await api.get('/bookings/export', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'bookings.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}
