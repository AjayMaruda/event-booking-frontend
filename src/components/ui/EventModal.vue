<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900">{{ isEdit ? 'Edit Event' : 'Create Event' }}</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 flex flex-col gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="e.g. Tech Conference 2025" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input v-model="form.date" type="date" class="input-field" :min="today" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input v-model.number="form.capacity" type="number" min="1" class="input-field" placeholder="e.g. 100" required />
          </div>

          <div v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {{ error }}
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="$emit('close')" class="btn-secondary flex-1">Cancel</button>
            <button type="submit" class="btn-primary flex-1" :disabled="loading">
              {{ loading ? 'Saving...' : isEdit ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { eventService } from '../../services/eventService'

const props = defineProps({
  event: { type: Object, default: null },
})
const emit = defineEmits(['close', 'saved'])

const isEdit = !!props.event
const loading = ref(false)
const error = ref(null)
const today = new Date().toISOString().split('T')[0]

const form = ref({
  name: props.event?.name || '',
  date: props.event?.date ? props.event.date.split('T')[0] : '',
  capacity: props.event?.capacity || '',
})

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  try {
    let result
    if (isEdit) {
      result = await eventService.update(props.event._id, form.value)
    } else {
      result = await eventService.create(form.value)
    }
    emit('saved', result.data)
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>
