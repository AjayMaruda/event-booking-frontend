<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Back -->
    <RouterLink to="/events" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
      ← Back to Events
    </RouterLink>

    <!-- Loading -->
    <div v-if="loading" class="card animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-2/3 mb-6"></div>
      <div class="h-4 bg-gray-100 rounded w-1/3 mb-3"></div>
      <div class="h-4 bg-gray-100 rounded w-1/2 mb-3"></div>
      <div class="h-4 bg-gray-100 rounded w-1/4 mb-6"></div>
      <div class="h-12 bg-gray-200 rounded"></div>
    </div>

    <!-- Event detail -->
    <div v-else-if="event" class="flex flex-col gap-6">
      <div class="card">
        <div class="flex items-start justify-between gap-4 mb-6">
          <h1 class="text-3xl font-bold text-gray-900 leading-tight">{{ event.name }}</h1>
          <span :class="seatBadge.class" class="shrink-0 text-sm font-medium px-3 py-1 rounded-full">
            {{ seatBadge.label }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
            <span class="text-2xl">📅</span>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide font-medium">Date</p>
              <p class="text-gray-900 font-semibold">{{ formattedDate }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
            <span class="text-2xl">🪑</span>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide font-medium">Seats</p>
              <p class="text-gray-900 font-semibold">{{ event.availableSeats }} / {{ event.capacity }} available</p>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
            <span class="text-2xl">👤</span>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide font-medium">Organizer</p>
              <p class="text-gray-900 font-semibold">{{ event.createdBy?.name || 'Admin' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
            <span class="text-2xl">📊</span>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide font-medium">Occupancy</p>
              <p class="text-gray-900 font-semibold">{{ occupancyPercent }}% full</p>
            </div>
          </div>
        </div>

        <!-- Progress -->
        <div class="mb-6">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>Seats booked</span>
            <span>{{ event.capacity - event.availableSeats }} / {{ event.capacity }}</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-3">
            <div
              class="h-3 rounded-full transition-all duration-700"
              :class="progressColor"
              :style="{ width: occupancyPercent + '%' }"
            ></div>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="!auth.isAdmin">
          <div v-if="!auth.isAuthenticated" class="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p class="text-blue-700 font-medium">Please log in to book this event</p>
            <RouterLink to="/login" class="btn-primary inline-block mt-3 px-8">Login to Book</RouterLink>
          </div>
          <button
            v-else
            @click="handleBook"
            :disabled="event.availableSeats === 0 || booking"
            class="btn-primary w-full py-3 text-base"
          >
            {{ booking ? 'Booking...' : event.availableSeats === 0 ? 'Sold Out' : '🎟️ Book This Event' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else class="text-center py-20">
      <div class="text-5xl mb-4">😕</div>
      <p class="text-gray-500">Event not found</p>
      <RouterLink to="/events" class="btn-primary inline-block mt-4">Back to Events</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'
import { eventService } from '../services/eventService'
import { bookingService } from '../services/bookingService'

const route = useRoute()
const auth = useAuthStore()
const toast = useToastStore()

const event = ref(null)
const loading = ref(true)
const booking = ref(false)

const formattedDate = computed(() =>
  event.value ? new Date(event.value.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }) : ''
)

const occupancyPercent = computed(() => {
  if (!event.value?.capacity) return 0
  return Math.round(((event.value.capacity - event.value.availableSeats) / event.value.capacity) * 100)
})

const progressColor = computed(() => {
  if (occupancyPercent.value >= 90) return 'bg-red-500'
  if (occupancyPercent.value >= 60) return 'bg-yellow-500'
  return 'bg-green-500'
})

const seatBadge = computed(() => {
  if (!event.value) return {}
  if (event.value.availableSeats === 0) return { class: 'bg-red-100 text-red-700', label: 'Sold Out' }
  if (event.value.availableSeats <= 10) return { class: 'bg-yellow-100 text-yellow-700', label: 'Almost Full' }
  return { class: 'bg-green-100 text-green-700', label: 'Available' }
})

const handleBook = async () => {
  booking.value = true
  try {
    await bookingService.book(event.value._id)
    toast.success(`Successfully booked "${event.value.name}"!`)
    event.value.availableSeats--
  } catch (err) {
    toast.error(err.response?.data?.message || 'Booking failed')
  } finally {
    booking.value = false
  }
}

onMounted(async () => {
  try {
    const res = await eventService.getOne(route.params.id)
    event.value = res.data
  } catch {
    event.value = null
  } finally {
    loading.value = false
  }
})
</script>
