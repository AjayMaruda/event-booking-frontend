<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <RouterLink to="/events" class="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8 group">
      <span class="transition-transform group-hover:-translate-x-1">←</span> Back to Events
    </RouterLink>

    <!-- Loading -->
    <div v-if="loading" class="card flex flex-col gap-6">
      <div class="skeleton h-8 rounded w-2/3"></div>
      <div class="grid grid-cols-2 gap-4">
        <div class="skeleton h-20 rounded-xl"></div>
        <div class="skeleton h-20 rounded-xl"></div>
        <div class="skeleton h-20 rounded-xl"></div>
        <div class="skeleton h-20 rounded-xl"></div>
      </div>
      <div class="skeleton h-14 rounded-xl"></div>
    </div>

    <div v-else-if="event" class="flex flex-col gap-6">

      <!-- Main Card -->
      <div class="card">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 mb-8">
          <div>
            <span :class="seatBadge.class" class="mb-3 inline-block">{{ seatBadge.label }}</span>
            <h1 class="text-3xl font-black text-white leading-tight">{{ event.name }}</h1>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0" style="background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2)); border: 1px solid rgba(99,102,241,0.3);">
            🎭
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="rounded-2xl p-4" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);">
            <p class="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Date</p>
            <p class="text-white font-bold">{{ formattedDate }}</p>
          </div>
          <div class="rounded-2xl p-4" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);">
            <p class="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Available</p>
            <p class="font-bold" :class="event.availableSeats === 0 ? 'text-red-400' : 'text-emerald-400'">
              {{ event.availableSeats }} / {{ event.capacity }}
            </p>
          </div>
          <div class="rounded-2xl p-4" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);">
            <p class="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Organizer</p>
            <p class="text-white font-bold">{{ event.createdBy?.name || 'Admin' }}</p>
          </div>
          <div class="rounded-2xl p-4" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);">
            <p class="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Occupancy</p>
            <p class="text-white font-bold">{{ occupancyPercent }}% full</p>
          </div>
        </div>

        <!-- Progress -->
        <div class="mb-8">
          <div class="flex justify-between text-xs text-white/30 mb-2">
            <span>{{ event.capacity - event.availableSeats }} booked</span>
            <span>{{ event.availableSeats }} remaining</span>
          </div>
          <div class="h-2 rounded-full" style="background: rgba(255,255,255,0.06);">
            <div class="h-2 rounded-full transition-all duration-700" :style="{ width: occupancyPercent + '%', background: progressGradient }"></div>
          </div>
        </div>

        <!-- CTA -->
        <div v-if="!auth.isAdmin">
          <div v-if="!auth.isAuthenticated" class="rounded-2xl p-5 text-center" style="background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2);">
            <p class="text-white/70 font-medium mb-4">Sign in to book this event</p>
            <RouterLink to="/login" class="btn-primary inline-flex px-8 py-3">Login to Book</RouterLink>
          </div>
          <button
            v-else
            @click="handleBook"
            :disabled="event.availableSeats === 0 || booking"
            class="btn-primary w-full py-4 text-base"
          >
            {{ booking ? 'Booking…' : event.availableSeats === 0 ? '🚫 Sold Out' : '🎟️ Book This Event' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-24">
      <div class="text-5xl mb-4">😕</div>
      <p class="text-white/40">Event not found</p>
      <RouterLink to="/events" class="btn-primary inline-flex mt-6 px-8">Back to Events</RouterLink>
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
  event.value ? new Date(event.value.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''
)
const occupancyPercent = computed(() => {
  if (!event.value?.capacity) return 0
  return Math.round(((event.value.capacity - event.value.availableSeats) / event.value.capacity) * 100)
})
const progressGradient = computed(() => {
  if (occupancyPercent.value >= 90) return 'linear-gradient(90deg, #ef4444, #dc2626)'
  if (occupancyPercent.value >= 60) return 'linear-gradient(90deg, #f59e0b, #d97706)'
  return 'linear-gradient(90deg, #6366f1, #8b5cf6)'
})
const seatBadge = computed(() => {
  if (!event.value) return {}
  if (event.value.availableSeats === 0) return { class: 'badge-danger', label: 'Sold Out' }
  if (event.value.availableSeats <= 10) return { class: 'badge-warning', label: 'Almost Full' }
  return { class: 'badge-success', label: 'Available' }
})

const handleBook = async () => {
  booking.value = true
  try {
    await bookingService.book(event.value._id)
    toast.success('Booked successfully! 🎉')
    event.value.availableSeats--
  } catch (err) {
    toast.error(err.response?.data?.message || 'Booking failed')
  } finally { booking.value = false }
}

onMounted(async () => {
  try {
    const res = await eventService.getOne(route.params.id)
    event.value = res.data
  } catch { event.value = null }
  finally { loading.value = false }
})
</script>
