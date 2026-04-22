<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="text-6xl mb-3">🎟️</div>
        <h1 class="text-3xl font-bold text-white">EventBook</h1>
        <p class="text-primary-200 mt-1">Sign in to your account</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input v-model="form.email" type="email" class="input-field" placeholder="john@example.com" required autofocus />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPw ? 'text' : 'password'" class="input-field pr-10" placeholder="••••••" required />
              <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {{ showPw ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div v-if="auth.error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {{ auth.error }}
          </div>

          <button type="submit" class="btn-primary w-full py-3 text-base mt-2" :disabled="auth.loading">
            {{ auth.loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Don't have an account?
          <RouterLink to="/register" class="text-primary-600 font-medium hover:underline">Register here</RouterLink>
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
    const redirect = route.query.redirect || '/events'
    router.push(redirect)
  } catch {}
}
</script>
