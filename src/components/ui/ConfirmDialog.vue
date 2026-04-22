<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);">
      <Transition name="modal" appear>
        <div class="w-full max-w-sm rounded-2xl p-6 text-center flex flex-col gap-5" style="background: #111118; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 40px 80px rgba(0,0,0,0.6);">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);">
            {{ icon }}
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">{{ title }}</h3>
            <p class="text-sm text-white/50 mt-2 leading-relaxed">{{ message }}</p>
          </div>
          <div class="flex gap-3">
            <button @click="$emit('cancel')" class="btn-secondary flex-1">Cancel</button>
            <button @click="$emit('confirm')" class="flex-1" :class="confirmClass" :disabled="loading">
              {{ loading ? 'Please wait…' : confirmText }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  title:        { type: String, default: 'Are you sure?' },
  message:      { type: String, default: '' },
  confirmText:  { type: String, default: 'Confirm' },
  confirmClass: { type: String, default: 'btn-danger' },
  icon:         { type: String, default: '⚠️' },
  loading:      { type: Boolean, default: false },
})
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from   { opacity: 0; transform: scale(0.85); }
.modal-leave-to     { opacity: 0; transform: scale(0.95); }
</style>
