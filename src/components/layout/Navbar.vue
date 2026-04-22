<template>
  <nav class="fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

      <!-- Logo -->
      <RouterLink to="/events" class="flex items-center gap-2 font-bold text-xl text-primary-600">
        <span class="text-2xl">🎟️</span>
        <span class="hidden sm:block">EventBook</span>
      </RouterLink>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-6">
        <RouterLink to="/events" class="nav-link">Events</RouterLink>
        <RouterLink v-if="auth.isAuthenticated" to="/my-bookings" class="nav-link">My Bookings</RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="nav-link">
          <span class="flex items-center gap-1">
            <span>⚙️</span> Admin
          </span>
        </RouterLink>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <template v-if="auth.isAuthenticated">
          <div class="hidden sm:flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
              {{ auth.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <span class="text-sm font-medium text-gray-700">{{ auth.user?.name }}</span>
            <span v-if="auth.isAdmin" class="badge-info">Admin</span>
          </div>
          <button @click="handleLogout" class="btn-secondary text-sm">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn-secondary text-sm">Login</RouterLink>
          <RouterLink to="/register" class="btn-primary text-sm">Register</RouterLink>
        </template>

        <!-- Mobile menu button -->
        <button class="md:hidden p-2 rounded-lg hover:bg-gray-100" @click="menuOpen = !menuOpen">
          <span class="text-xl">{{ menuOpen ? '✕' : '☰' }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide">
      <div v-if="menuOpen" class="md:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-2">
        <RouterLink to="/events" class="nav-link py-2" @click="menuOpen = false">Events</RouterLink>
        <RouterLink v-if="auth.isAuthenticated" to="/my-bookings" class="nav-link py-2" @click="menuOpen = false">My Bookings</RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="nav-link py-2" @click="menuOpen = false">Admin Panel</RouterLink>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useToastStore } from '../../stores/toastStore'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const menuOpen = ref(false)

const handleLogout = () => {
  auth.logout()
  toast.success('Logged out successfully')
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors duration-200;
}
.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
