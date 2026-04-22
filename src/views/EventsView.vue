<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <!-- Hero -->
    <div class="text-center mb-14">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-400 mb-6" style="background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);">
        ✨ Discover Amazing Events
      </div>
      <h1 class="text-5xl sm:text-6xl font-black text-white leading-none mb-4">
        Upcoming <span class="gradient-text">Events</span>
      </h1>
      <p class="text-white/40 text-lg max-w-xl mx-auto">Find and book your next unforgettable experience</p>
    </div>

    <!-- Filters -->
    <div class="card mb-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">From</label>
          <input v-model="filters.start" type="date" class="input-field" @change="onFilter" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">To</label>
          <input v-model="filters.end" type="date" class="input-field" @change="onFilter" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Per Page</label>
          <select v-model="filters.limit" class="input-field" @change="onFilter">
            <option value="6">6 events</option>
            <option value="12">12 events</option>
            <option value="24">24 events</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="clearFilters" class="btn-secondary w-full">Clear</button>
        </div>
      </div>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card flex flex-col gap-4">
        <div class="flex justify-between">
          <div class="skeleton w-10 h-10 rounded-xl"></div>
          <div class="skeleton w-20 h-6 rounded-full"></div>
        </div>
        <div class="skeleton h-5 rounded w-4/5"></div>
        <div class="skeleton h-3 rounded w-2/5"></div>
        <div class="skeleton h-3 rounded w-3/5"></div>
        <div class="skeleton h-1.5 rounded-full"></div>
        <div class="flex gap-2">
          <div class="skeleton h-9 rounded-xl flex-1"></div>
          <div class="skeleton h-9 rounded-xl flex-1"></div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-24">
      <div class="text-5xl mb-4">😕</div>
      <p class="text-red-400 font-medium">{{ error }}</p>
      <button @click="fetchEvents" class="btn-primary mt-6 px-8">Retry</button>
    </div>

    <!-- Empty -->
    <div v-else-if="!events.length" class="text-center py-24">
      <div class="text-6xl mb-4">📭</div>
      <p class="text-white/40 text-lg">No events found</p>
      <p class="text-white/20 text-sm mt-1">Try adjusting your date filters</p>
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
    <div v-if="pagination.totalPages > 1" class="flex items-center justify-center gap-2 mt-12">
      <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="btn-secondary px-4 py-2 disabled:opacity-30">←</button>
      <div class="flex gap-1">
        <button
          v-for="p in pagination.totalPages" :key="p"
          @click="changePage(p)"
          class="w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200"
          :class="p === pagination.page ? 'btn-primary' : 'btn-secondary'"
        >{{ p }}</button>
      </div>
      <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.totalPages" class="btn-secondary px-4 py-2 disabled:opacity-30">→</button>
    </div>

    <p v-if="pagination.total" class="text-center text-xs text-white/25 mt-4">
      {{ events.length }} of {{ pagination.total }} events
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
  loading.value = true; error.value = null
  try {
    const params = { page: pagination.value.page, limit: filters.value.limit }
    if (filters.value.start) params.start = filters.value.start
    if (filters.value.end) params.end = filters.value.end
    const res = await eventService.getAll(params)
    events.value = res.data.events
    pagination.value = { page: res.data.page, total: res.data.total, totalPages: res.data.totalPages }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load events'
  } finally { loading.value = false }
}

const onFilter = () => { pagination.value.page = 1; fetchEvents() }
const changePage = (p) => { pagination.value.page = p; fetchEvents() }
const clearFilters = () => { filters.value = { start: '', end: '', limit: '6' }; onFilter() }

const handleBook = async (event) => {
  if (!auth.isAuthenticated) return toast.info('Please login to book')
  bookingId.value = event._id
  try {
    await bookingService.book(event._id)
    toast.success(`Booked "${event.name}" 🎉`)
    fetchEvents()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Booking failed')
  } finally { bookingId.value = null }
}

onMounted(fetchEvents)
</script>
