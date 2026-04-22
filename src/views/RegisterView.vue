<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">

      <div class="text-center mb-8">
        <div class="text-6xl mb-3">🎟️</div>
        <h1 class="text-3xl font-bold text-white">EventBook</h1>
        <p class="text-primary-200 mt-1">Create your account</p>
      </div>

      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="John Doe" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input v-model="form.email" type="email" class="input-field" placeholder="john@example.com" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPw ? 'text' : 'password'" class="input-field pr-10" placeholder="Min. 6 characters" required minlength="6" />
              <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {{ showPw ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select v-model="form.role" class="input-field">
              <option value="user">User — Browse & Book events</option>
              <option value="admin">Admin — Manage events</option>
            </select>
          </div>

          <div v-if="auth.error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {{ auth.error }}
          </div>

          <button type="submit" class="btn-primary w-full py-3 text-base mt-2" :disabled="auth.loading">
            {{ auth.loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Already have an account?
          <RouterLink to="/login" class="text-primary-600 font-medium hover:underline">Sign in here</RouterLink>
        </p>
      </div>
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
    toast.success(`Welcome, ${auth.user.name}! Account created.`)
    router.push('/events')
  } catch {}
}
</script>
