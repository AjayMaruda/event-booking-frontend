<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <!-- Header -->
    <div class="flex items-center justify-between mb-10 flex-wrap gap-4">
      <div>
        <h1 class="text-4xl font-black text-white">My Bookings</h1>
        <p class="text-white/40 mt-1">Your event reservations</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="px-4 py-2 rounded-xl text-sm font-semibold text-emerald-400" style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2);">
          {{ bookings.filter(b => b.status === 'confirmed').length }} Active
        </div>
        <div class="px-4 py-2 rounded-xl text-sm font-semibold text-white/40" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
          {{ bookings.length }} Total
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col gap-4">
      <div v-for="i in 3" :key="i" class="card flex gap-4">
        <div class="skeleton w-12 h-12 rounded-xl shrink-0"></div>
        <div class="flex-1 flex flex-col gap-2">
          <div class="skeleton h-5 rounded w-1/2"></div>
          <div class="skeleton h-3 rounded w-1/3"></div>
        </div>
        <div class="skeleton w-20 h-9 rounded-xl"></div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!bookings.length" class="text-center py-24">
      <div class="text-6xl mb-4">🎟️</div>
      <p class="text-white font-bold text-xl">No bookings yet</p>
      <p class="text-white/40 text-sm mt-2">Start exploring events and book your seat!</p>
      <RouterLink to="/events" class="btn-primary inline-flex mt-6 px-8 py-3">Browse Events</RouterLink>
    </div>

    <!-- Bookings -->
    <div v-else class="flex flex-col gap-4">
      <div
        v-for="booking in bookings" :key="booking._id"
        class="card flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-300"
        :class="booking.status === 'cancelled' ? 'opacity-40' : 'card-hover'"
      >
        <!-- Icon -->
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
          :style="booking.status === 'confirmed'
            ? 'background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);'
            : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);'">
          🎭
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <h3 class="font-bold text-white truncate">{{ booking.event?.name }}</h3>
            <span :class="booking.status === 'confirmed' ? 'badge-success' : 'badge-danger'">{{ booking.status }}</span>
          </div>
          <div class="flex flex-wrap gap-3 text-xs text-white/40">
            <span>📅 {{ formatDate(booking.event?.date) }}</span>
            <span>🪑 {{ booking.event?.availableSeats }} left</span>
            <span>🕐 {{ formatDate(booking.createdAt) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 shrink-0">
          <RouterLink :to="`/events/${booking.event?._id}`" class="btn-secondary text-xs px-3 py-2">View</RouterLink>
          <button v-if="booking.status === 'confirmed'" @click="confirmCancel(booking)" class="btn-danger text-xs px-3 py-2">Cancel</button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      v-if="cancelTarget"
      title="Cancel Booking?"
      :message="`Cancel your booking for &quot;${cancelTarget.event?.name}&quot;? Your seat will be released.`"
      confirm-text="Yes, Cancel"
      :loading="cancelling"
      @confirm="handleCancel"
      @cancel="cancelTarget = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToastStore } from '../stores/toastStore'
import { bookingService } from '../services/bookingService'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'

const toast = useToastStore()
const bookings = ref([])
const loading = ref(true)
const cancelTarget = ref(null)
const cancelling = ref(false)

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'

const fetchBookings = async () => {
  loading.value = true
  try { const res = await bookingService.myBookings(); bookings.value = res.data }
  catch { toast.error('Failed to load bookings') }
  finally { loading.value = false }
}

const confirmCancel = (b) => { cancelTarget.value = b }
const handleCancel = async () => {
  cancelling.value = true
  try {
    await bookingService.cancel(cancelTarget.value._id)
    toast.success('Booking cancelled')
    const b = bookings.value.find(x => x._id === cancelTarget.value._id)
    if (b) b.status = 'cancelled'
    cancelTarget.value = null
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to cancel')
  } finally { cancelling.value = false }
}

onMounted(fetchBookings)
</script>
