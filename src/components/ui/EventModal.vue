<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);" @click.self="$emit('close')">
      <Transition name="modal" appear>
        <div class="w-full max-w-md rounded-2xl overflow-hidden" style="background: #111118; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 40px 80px rgba(0,0,0,0.6);">

          <!-- Header -->
          <div class="px-6 pt-6 pb-4 flex items-center justify-between" style="border-bottom: 1px solid rgba(255,255,255,0.06);">
            <div>
              <h2 class="text-lg font-bold text-white">{{ isEdit ? 'Edit Event' : 'Create New Event' }}</h2>
              <p class="text-xs text-white/40 mt-0.5">{{ isEdit ? 'Update event details' : 'Fill in the details below' }}</p>
            </div>
            <button @click="$emit('close')" class="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">✕</button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6 flex flex-col gap-4">

            <div>
              <label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Event Name</label>
              <input v-model="form.name" type="text" class="input-field" placeholder="e.g. Tech Summit 2025" required />
            </div>

            <div>
              <label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Date</label>
              <input v-model="form.date" type="date" class="input-field" :min="today" required />
            </div>

            <div>
              <label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Capacity</label>
              <input v-model.number="form.capacity" type="number" min="1" class="input-field" placeholder="e.g. 100" required />
            </div>

            <div v-if="error" class="rounded-xl px-4 py-3 text-sm text-red-400" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);">
              {{ error }}
            </div>

            <div class="flex gap-3 pt-2">
              <button type="button" @click="$emit('close')" class="btn-secondary flex-1">Cancel</button>
              <button type="submit" class="btn-primary flex-1" :disabled="loading">
                {{ loading ? 'Saving…' : isEdit ? 'Update Event' : 'Create Event' }}
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { eventService } from '../../services/eventService'

const props = defineProps({ event: { type: Object, default: null } })
const emit = defineEmits(['close', 'saved'])

const isEdit = !!props.event
const loading = ref(false)
const error = ref(null)
const today = new Date().toISOString().split('T')[0]

const form = ref({
  name:     props.event?.name || '',
  date:     props.event?.date ? props.event.date.split('T')[0] : '',
  capacity: props.event?.capacity || '',
})

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  try {
    const res = isEdit
      ? await eventService.update(props.event._id, form.value)
      : await eventService.create(form.value)
    emit('saved', res.data)
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from   { opacity: 0; transform: scale(0.9) translateY(20px); }
.modal-leave-to     { opacity: 0; transform: scale(0.95); }
</style>
