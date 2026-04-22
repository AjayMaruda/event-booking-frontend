<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm font-medium cursor-pointer"
          :class="classes[toast.type]"
          @click="toastStore.remove(toast.id)"
        >
          <span class="text-lg leading-none">{{ icons[toast.type] }}</span>
          <span class="flex-1">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '../../stores/toastStore'

const toastStore = useToastStore()

const classes = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50 border-red-200 text-red-800',
  info:    'bg-blue-50 border-blue-200 text-blue-800',
}
const icons = { success: '✅', error: '❌', info: 'ℹ️' }
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to   { opacity: 0; transform: translateX(100%); }
</style>
