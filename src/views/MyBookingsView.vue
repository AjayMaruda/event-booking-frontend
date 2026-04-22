<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p class="text-gray-500 mt-1">Manage your event reservations</p>
      </div>
      <div class="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
        {{ bookings.filter(b => b.status === 'confirmed').length }} active
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col gap-4">
      <div v-for="i in 3" :key="i" class="card animate-pulse flex gap-4">
        <div class="flex-1">
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-4 bg-gray-100 rounded w-1/3 mb-2"></div>
          <div class="h-4 bg-gray-100 rounded w-1/4"></div>
        </div>
        <div class="h-9 w-24 bg-gray-200 rounded-lg self-center"></div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!bookings.length" class="text-center py-20">
      <div class="text-6xl mb-4">🎟️</div>
      <p class="text-gray-500 text-lg font-medium">No bookings yet</p>
      <p class="text-gray-400 text-sm mt-1">Start exploring events!</p>
      <RouterLink to="/events" class="btn-primary inline-block mt-6 px-8">Browse Events</RouterLink>
    </div>

    <!-- Bookings list -->
    <div v-else class="flex flex-col gap-4">
      <div
        v-for="booking in bookings"
        :key="booking._id"
        class="card flex flex-col sm:flex-row sm:items-center gap-4"
        :class="booking.status === 'cancelled' ? 'opacity-60' : ''"
      >
        <!-- Event info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <h3 class="font-semibold text-gray-900 truncate">{{ booking.event?.name }}</h3>
            <span :class="booking.status === 'confirmed' ? 'badge-success' : 'badge-danger'">
              {{ booking.status }}
            </span>
          </div>
          <div class="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-500 gap-1">
            <span class="flex items-center gap-1">📅 {{ formatDate(booking.event?.date) }}</span>
            <span class="flex items-center gap-1">🪑 {{ booking.event?.availableSeats }} seats left</span>
            <span class="flex items-center gap-1">🕐 Booked {{ formatDate(booking.createdAt) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 shrink-0">
          <RouterLink :to="`/events/${booking.event?._id}`" class="btn-secondary text-sm px-3 py-2">
            View
          </RouterLink>
          <button
            v-if="booking.status === 'confirmed'"
            @click="confirmCancel(booking)"
            class="btn-danger text-sm px-3 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      v-if="cancelTarget"
      title="Cancel Booking?"
      :message="`Are you sure you want to cancel your booking for &quot;${cancelTarget.event?.name}&quot;?`"
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

const formatDate = (date) => date
  ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  : 'N/A'

const fetchBookings = async () => {
  loading.value = true
  try {
    const res = await bookingService.myBookings()
    bookings.value = res.data
  } catch (err) {
    toast.error('Failed to load bookings')
  } finally {
    loading.value = false
  }
}

const confirmCancel = (booking) => {
  cancelTarget.value = booking
}

const handleCancel = async () => {
  cancelling.value = true
  try {
    await bookingService.cancel(cancelTarget.value._id)
    toast.success('Booking cancelled successfully')
    const b = bookings.value.find(x => x._id === cancelTarget.value._id)
    if (b) b.status = 'cancelled'
    cancelTarget.value = null
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to cancel booking')
  } finally {
    cancelling.value = false
  }
}

onMounted(fetchBookings)
</script>
