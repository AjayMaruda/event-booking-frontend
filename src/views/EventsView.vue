<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Hero -->
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Upcoming Events</h1>
      <p class="text-gray-500 text-lg">Discover and book your next experience</p>
    </div>

    <!-- Filters -->
    <div class="card mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">From Date</label>
          <input v-model="filters.start" type="date" class="input-field" @change="fetchEvents" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">To Date</label>
          <input v-model="filters.end" type="date" class="input-field" @change="fetchEvents" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Per Page</label>
          <select v-model="filters.limit" class="input-field" @change="fetchEvents">
            <option value="6">6</option>
            <option value="12">12</option>
            <option value="24">24</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="clearFilters" class="btn-secondary w-full">Clear Filters</button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-100 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-gray-100 rounded w-2/3 mb-4"></div>
        <div class="h-2 bg-gray-100 rounded mb-4"></div>
        <div class="h-9 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20">
      <div class="text-5xl mb-4">😕</div>
      <p class="text-red-600 font-medium">{{ error }}</p>
      <button @click="fetchEvents" class="btn-primary mt-4">Try Again</button>
    </div>

    <!-- Empty -->
    <div v-else-if="!events.length" class="text-center py-20">
      <div class="text-5xl mb-4">📭</div>
      <p class="text-gray-500 text-lg">No events found</p>
      <p class="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
    </div>

    <!-- Events Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <EventCard
        v-for="event in events"
        :key="event._id"
        :event="event"
        :show-book="auth.isAuthenticated && !auth.isAdmin"
        :booking="bookingId === event._id"
        @book="handleBook"
      />
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex items-center justify-center gap-2 mt-10">
      <button
        @click="changePage(pagination.page - 1)"
        :disabled="pagination.page === 1"
        class="btn-secondary px-3 py-2 disabled:opacity-40"
      >← Prev</button>

      <div class="flex gap-1">
        <button
          v-for="p in pagination.totalPages"
          :key="p"
          @click="changePage(p)"
          class="w-9 h-9 rounded-lg text-sm font-medium transition-colors"
          :class="p === pagination.page ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'"
        >{{ p }}</button>
      </div>

      <button
        @click="changePage(pagination.page + 1)"
        :disabled="pagination.page === pagination.totalPages"
        class="btn-secondary px-3 py-2 disabled:opacity-40"
      >Next →</button>
    </div>

    <!-- Stats bar -->
    <p v-if="pagination.total" class="text-center text-sm text-gray-400 mt-4">
      Showing {{ events.length }} of {{ pagination.total }} events
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'
import { eventService } from '../services/eventService'
import { bookingService } from '../services/bookingService'
import EventCard from '../components/ui/EventCard.vue'

const auth = useAuthStore()
const toast = useToastStore()

const events = ref([])
const loading = ref(false)
const error = ref(null)
const bookingId = ref(null)

const filters = ref({ start: '', end: '', limit: '6' })
const pagination = ref({ page: 1, total: 0, totalPages: 1 })

const fetchEvents = async () => {
  loading.value = true
  error.value = null
  try {
    const params = { page: pagination.value.page, limit: filters.value.limit }
    if (filters.value.start) params.start = filters.value.start
    if (filters.value.end) params.end = filters.value.end

    const res = await eventService.getAll(params)
    events.value = res.data.events
    pagination.value = {
      page: res.data.page,
      total: res.data.total,
      totalPages: res.data.totalPages,
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load events'
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  pagination.value.page = page
  fetchEvents()
}

const clearFilters = () => {
  filters.value = { start: '', end: '', limit: '6' }
  pagination.value.page = 1
  fetchEvents()
}

const handleBook = async (event) => {
  if (!auth.isAuthenticated) {
    toast.info('Please login to book an event')
    return
  }
  bookingId.value = event._id
  try {
    await bookingService.book(event._id)
    toast.success(`Successfully booked "${event.name}"!`)
    fetchEvents() // Refresh to update seat count
  } catch (err) {
    toast.error(err.response?.data?.message || 'Booking failed')
  } finally {
    bookingId.value = null
  }
}

onMounted(fetchEvents)
</script>
