<template>
  <div class="card hover:shadow-md transition-shadow duration-200 flex flex-col gap-4">
    <!-- Header -->
    <div class="flex items-start justify-between gap-2">
      <h3 class="font-semibold text-gray-900 text-lg leading-snug line-clamp-2">{{ event.name }}</h3>
      <span :class="seatBadge.class" class="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full">
        {{ seatBadge.label }}
      </span>
    </div>

    <!-- Info -->
    <div class="flex flex-col gap-2 text-sm text-gray-600">
      <div class="flex items-center gap-2">
        <span>📅</span>
        <span>{{ formattedDate }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span>🪑</span>
        <span>{{ event.availableSeats }} / {{ event.capacity }} seats available</span>
      </div>
      <div v-if="event.createdBy" class="flex items-center gap-2">
        <span>👤</span>
        <span>{{ event.createdBy?.name || 'Admin' }}</span>
      </div>
    </div>

    <!-- Seat progress bar -->
    <div class="w-full bg-gray-100 rounded-full h-1.5">
      <div
        class="h-1.5 rounded-full transition-all duration-500"
        :class="progressColor"
        :style="{ width: occupancyPercent + '%' }"
      ></div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 mt-auto pt-2">
      <RouterLink :to="`/events/${event._id}`" class="btn-secondary text-sm flex-1 text-center">
        View Details
      </RouterLink>
      <button
        v-if="showBook"
        @click="$emit('book', event)"
        :disabled="event.availableSeats === 0 || booking"
        class="btn-primary text-sm flex-1"
      >
        {{ booking ? 'Booking...' : event.availableSeats === 0 ? 'Full' : 'Book Now' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  event: { type: Object, required: true },
  showBook: { type: Boolean, default: true },
  booking: { type: Boolean, default: false },
})

defineEmits(['book'])

const formattedDate = computed(() =>
  new Date(props.event.date).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
  })
)

const occupancyPercent = computed(() => {
  if (!props.event.capacity) return 0
  const booked = props.event.capacity - props.event.availableSeats
  return Math.round((booked / props.event.capacity) * 100)
})

const progressColor = computed(() => {
  if (occupancyPercent.value >= 90) return 'bg-red-500'
  if (occupancyPercent.value >= 60) return 'bg-yellow-500'
  return 'bg-green-500'
})

const seatBadge = computed(() => {
  if (props.event.availableSeats === 0) return { class: 'bg-red-100 text-red-700', label: 'Sold Out' }
  if (props.event.availableSeats <= 10) return { class: 'bg-yellow-100 text-yellow-700', label: 'Almost Full' }
  return { class: 'bg-green-100 text-green-700', label: 'Available' }
})
</script>
