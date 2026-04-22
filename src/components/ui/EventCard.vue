<template>
  <div class="card card-hover flex flex-col gap-4 group cursor-pointer animate-fade-up">

    <!-- Top Row -->
    <div class="flex items-start justify-between gap-3">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style="background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2)); border: 1px solid rgba(99,102,241,0.3);">
        🎭
      </div>
      <span :class="seatBadge.class">{{ seatBadge.label }}</span>
    </div>

    <!-- Title -->
    <div>
      <h3 class="font-bold text-white text-base leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors duration-200">
        {{ event.name }}
      </h3>
    </div>

    <!-- Meta -->
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2 text-xs text-white/50">
        <span class="w-4 text-center">📅</span>
        <span>{{ formattedDate }}</span>
      </div>
      <div class="flex items-center gap-2 text-xs text-white/50">
        <span class="w-4 text-center">🪑</span>
        <span>{{ event.availableSeats }} of {{ event.capacity }} seats left</span>
      </div>
    </div>

    <!-- Seat progress -->
    <div>
      <div class="flex justify-between text-xs text-white/30 mb-1.5">
        <span>Occupancy</span>
        <span>{{ occupancyPercent }}%</span>
      </div>
      <div class="w-full h-1.5 rounded-full" style="background: rgba(255,255,255,0.06);">
        <div
          class="h-1.5 rounded-full transition-all duration-700"
          :style="{ width: occupancyPercent + '%', background: progressGradient }"
        ></div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 pt-1">
      <RouterLink
        :to="`/events/${event._id}`"
        class="btn-secondary text-xs flex-1 text-center py-2 px-3"
      >
        Details
      </RouterLink>
      <button
        v-if="showBook"
        @click.stop="$emit('book', event)"
        :disabled="event.availableSeats === 0 || booking"
        class="btn-primary text-xs flex-1 py-2 px-3"
      >
        <span v-if="booking">Booking…</span>
        <span v-else-if="event.availableSeats === 0">Sold Out</span>
        <span v-else>Book Now</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  event:    { type: Object, required: true },
  showBook: { type: Boolean, default: true },
  booking:  { type: Boolean, default: false },
})
defineEmits(['book'])

const formattedDate = computed(() =>
  new Date(props.event.date).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  })
)

const occupancyPercent = computed(() => {
  if (!props.event.capacity) return 0
  return Math.round(((props.event.capacity - props.event.availableSeats) / props.event.capacity) * 100)
})

const progressGradient = computed(() => {
  if (occupancyPercent.value >= 90) return 'linear-gradient(90deg, #ef4444, #dc2626)'
  if (occupancyPercent.value >= 60) return 'linear-gradient(90deg, #f59e0b, #d97706)'
  return 'linear-gradient(90deg, #6366f1, #8b5cf6)'
})

const seatBadge = computed(() => {
  if (props.event.availableSeats === 0)  return { class: 'badge-danger', label: 'Sold Out' }
  if (props.event.availableSeats <= 10)  return { class: 'badge-warning', label: 'Few Left' }
  return { class: 'badge-success', label: 'Available' }
})
</script>
