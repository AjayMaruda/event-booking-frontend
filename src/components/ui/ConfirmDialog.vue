<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div class="text-center">
          <div class="text-4xl mb-3">{{ icon }}</div>
          <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ message }}</p>
        </div>
        <div class="flex gap-3">
          <button @click="$emit('cancel')" class="btn-secondary flex-1">Cancel</button>
          <button @click="$emit('confirm')" class="flex-1" :class="confirmClass" :disabled="loading">
            {{ loading ? 'Please wait...' : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  title:       { type: String, default: 'Are you sure?' },
  message:     { type: String, default: '' },
  confirmText: { type: String, default: 'Confirm' },
  confirmClass:{ type: String, default: 'btn-danger' },
  icon:        { type: String, default: '⚠️' },
  loading:     { type: Boolean, default: false },
})
defineEmits(['confirm', 'cancel'])
</script>
