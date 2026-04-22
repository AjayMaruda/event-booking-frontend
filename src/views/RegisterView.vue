<template>
  <div class="min-h-screen flex items-center justify-center p-6" style="background: #0a0a0f; background-image: radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 60%);">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 text-2xl" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); box-shadow: 0 8px 30px rgba(99,102,241,0.4);">🎟️</div>
        <h1 class="text-3xl font-black text-white">Create Account</h1>
        <p class="text-white/40 mt-2 text-sm">Join thousands booking amazing events</p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl p-8" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);">
        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">

          <div>
            <label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Full Name</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="John Doe" required />
          </div>

          <div>
            <label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email</label>
            <input v-model="form.email" type="email" class="input-field" placeholder="you@example.com" required />
          </div>

          <div>
            <label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPw ? 'text' : 'password'" class="input-field pr-12" placeholder="Min. 6 characters" required minlength="6" />
              <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-sm px-1">
                {{ showPw ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Account Type</label>
            <div class="grid grid-cols-2 gap-3">
              <button type="button" @click="form.role = 'user'"
                class="p-3 rounded-xl text-left transition-all duration-200"
                :style="form.role === 'user' ? 'background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.4);' : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);'">
                <div class="text-lg mb-1">👤</div>
                <p class="text-sm font-semibold text-white">User</p>
                <p class="text-xs text-white/40">Browse & book</p>
              </button>
              <button type="button" @click="form.role = 'admin'"
                class="p-3 rounded-xl text-left transition-all duration-200"
                :style="form.role === 'admin' ? 'background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.4);' : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);'">
                <div class="text-lg mb-1">⚙️</div>
                <p class="text-sm font-semibold text-white">Admin</p>
                <p class="text-xs text-white/40">Manage events</p>
              </button>
            </div>
          </div>

          <div v-if="auth.error" class="rounded-xl px-4 py-3 text-sm text-red-400" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);">
            {{ auth.error }}
          </div>

          <button type="submit" class="btn-primary w-full py-3.5 text-sm mt-2" :disabled="auth.loading">
            {{ auth.loading ? 'Creating account…' : 'Create Account' }}
          </button>
        </form>
      </div>

      <p class="text-center text-sm text-white/40 mt-6">
        Already have an account?
        <RouterLink to="/login" class="text-indigo-400 hover:text-indigo-300 font-semibold ml-1 transition-colors">Sign in →</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const form = ref({ name: '', email: '', password: '', role: 'user' })
const showPw = ref(false)

const handleRegister = async () => {
  try {
    await auth.register(form.value)
    toast.success(`Welcome, ${auth.user.name}! 🎉`)
    router.push('/events')
  } catch {}
}
</script>
