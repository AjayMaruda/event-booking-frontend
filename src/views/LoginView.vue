<template>
  <div class="min-h-screen flex">

    <!-- Left Panel - Decorative -->
    <div class="hidden lg:flex flex-1 relative overflow-hidden" style="background: linear-gradient(135deg, #0f0f1a, #1a1a2e);">
      <div class="absolute inset-0" style="background: radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(139,92,246,0.1) 0%, transparent 50%);"></div>

      <!-- Floating Cards -->
      <div class="absolute top-1/4 left-1/4 -translate-x-1/2 card p-4 w-52 animate-float" style="animation-delay: 0s;">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">🎭</div>
          <div>
            <p class="text-xs font-semibold text-white">Tech Summit 2025</p>
            <p class="text-xs text-white/40">Dec 25 · 250 seats</p>
          </div>
        </div>
        <div class="h-1.5 rounded-full bg-white/10"><div class="h-1.5 rounded-full w-3/4" style="background: linear-gradient(90deg, #6366f1, #8b5cf6);"></div></div>
      </div>

      <div class="absolute top-1/2 right-1/4 translate-x-1/2 card p-4 w-48 animate-float" style="animation-delay: 2s;">
        <p class="text-xs text-white/50 mb-1">Booked!</p>
        <p class="text-sm font-bold text-white">🎉 Music Festival</p>
        <p class="text-xs text-emerald-400 mt-1">✓ Confirmed</p>
      </div>

      <div class="absolute bottom-1/3 left-1/3 card p-4 animate-float" style="animation-delay: 4s;">
        <p class="text-2xl font-black gradient-text">1,240+</p>
        <p class="text-xs text-white/40">Events booked</p>
      </div>

      <div class="absolute bottom-8 left-8 right-8 text-center">
        <p class="text-white/20 text-sm">EventBook · Discover & Book Amazing Events</p>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="flex-1 flex items-center justify-center p-8" style="background: #0a0a0f;">
      <div class="w-full max-w-sm">

        <!-- Logo -->
        <div class="mb-10">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); box-shadow: 0 4px 20px rgba(99,102,241,0.4);">🎟️</div>
            <span class="font-bold text-xl gradient-text">EventBook</span>
          </div>
          <h1 class="text-3xl font-black text-white">Welcome back</h1>
          <p class="text-white/40 mt-2 text-sm">Sign in to continue to your account</p>
        </div>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div>
            <label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email</label>
            <input v-model="form.email" type="email" class="input-field" placeholder="you@example.com" required autofocus />
          </div>

          <div>
            <label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPw ? 'text' : 'password'" class="input-field pr-12" placeholder="••••••••" required />
              <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-sm px-1">
                {{ showPw ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div v-if="auth.error" class="rounded-xl px-4 py-3 text-sm text-red-400" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);">
            {{ auth.error }}
          </div>

          <button type="submit" class="btn-primary w-full py-3.5 text-sm mt-2" :disabled="auth.loading">
            {{ auth.loading ? 'Signing in…' : 'Sign In' }}
          </button>
        </form>

        <p class="text-center text-sm text-white/40 mt-8">
          No account yet?
          <RouterLink to="/register" class="text-indigo-400 hover:text-indigo-300 font-semibold ml-1 transition-colors">Create one →</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()
const form = ref({ email: '', password: '' })
const showPw = ref(false)

const handleLogin = async () => {
  try {
    await auth.login(form.value)
    toast.success(`Welcome back, ${auth.user.name}!`)
    router.push(route.query.redirect || '/events')
  } catch {}
}
</script>
