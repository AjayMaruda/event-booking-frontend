<template>
  <Teleport to="body">
    <div class="fixed top-6 right-6 z-50 flex flex-col gap-3 w-80">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="flex items-center gap-3 p-4 rounded-2xl cursor-pointer select-none"
          :class="styles[toast.type]"
          @click="toastStore.remove(toast.id)"
          style="backdrop-filter: blur(20px); box-shadow: 0 20px 40px rgba(0,0,0,0.4);"
        >
          <div class="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0" :class="iconBg[toast.type]">
            {{ icons[toast.type] }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold" :class="textColor[toast.type]">{{ labels[toast.type] }}</p>
            <p class="text-xs mt-0.5 text-white/60 leading-snug">{{ toast.message }}</p>
          </div>
          <button class="text-white/30 hover:text-white/60 text-lg leading-none">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '../../stores/toastStore'
const toastStore = useToastStore()

const styles = {
  success: 'border border-emerald-500/20 bg-emerald-950/80',
  error:   'border border-red-500/20 bg-red-950/80',
  info:    'border border-indigo-500/20 bg-indigo-950/80',
}
const iconBg = {
  success: 'bg-emerald-500/20',
  error:   'bg-red-500/20',
  info:    'bg-indigo-500/20',
}
const textColor = {
  success: 'text-emerald-400',
  error:   'text-red-400',
  info:    'text-indigo-400',
}
const icons =  { success: '✓', error: '✕', info: 'i' }
const labels = { success: 'Success', error: 'Error', info: 'Info' }
</script>

<style scoped>
.toast-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(100%) scale(0.9); }
.toast-leave-to     { opacity: 0; transform: translateX(100%) scale(0.95); }
</style>
