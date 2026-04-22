<template>
  <nav class="fixed top-0 inset-x-0 z-40 transition-all duration-300" :class="scrolled ? 'nav-scrolled' : 'nav-top'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

      <!-- Logo -->
      <RouterLink to="/events" class="flex items-center gap-3 group">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform duration-300 group-hover:scale-110" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); box-shadow: 0 4px 15px rgba(99,102,241,0.4);">
          🎟️
        </div>
        <span class="font-bold text-lg hidden sm:block gradient-text">EventBook</span>
      </RouterLink>

      <!-- Desktop Nav Links -->
      <div class="hidden md:flex items-center gap-1">
        <RouterLink to="/events" class="nav-link" :class="{ 'nav-link-active': route.name === 'Events' }">
          Events
        </RouterLink>
        <RouterLink v-if="auth.isAuthenticated" to="/my-bookings" class="nav-link" :class="{ 'nav-link-active': route.name === 'MyBookings' }">
          My Bookings
        </RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="nav-link" :class="{ 'nav-link-active': route.name === 'Admin' }">
          ⚙️ Admin
        </RouterLink>
      </div>

      <!-- Right Side -->
      <div class="flex items-center gap-3">
        <template v-if="auth.isAuthenticated">
          <div class="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl glass">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
              {{ auth.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <span class="text-sm font-medium text-white/80">{{ auth.user?.name }}</span>
            <span v-if="auth.isAdmin" class="badge-info text-xs">Admin</span>
          </div>
          <button @click="handleLogout" class="btn-secondary text-sm px-4 py-2">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn-secondary text-sm px-4 py-2">Login</RouterLink>
          <RouterLink to="/register" class="btn-primary text-sm px-4 py-2">Get Started</RouterLink>
        </template>

        <!-- Mobile Menu Toggle -->
        <button class="md:hidden w-9 h-9 rounded-xl glass flex items-center justify-center" @click="menuOpen = !menuOpen">
          <span class="text-white/80 text-sm">{{ menuOpen ? '✕' : '☰' }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div v-if="menuOpen" class="md:hidden px-4 pb-4 flex flex-col gap-1 border-t border-white/5" style="background: rgba(10,10,15,0.98); backdrop-filter: blur(20px);">
        <RouterLink to="/events" class="nav-link py-3" @click="menuOpen = false">Events</RouterLink>
        <RouterLink v-if="auth.isAuthenticated" to="/my-bookings" class="nav-link py-3" @click="menuOpen = false">My Bookings</RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="nav-link py-3" @click="menuOpen = false">Admin Panel</RouterLink>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useToastStore } from '../../stores/toastStore'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()
const menuOpen = ref(false)
const scrolled = ref(false)

const onScroll = () => { scrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const handleLogout = () => {
  auth.logout()
  toast.success('See you next time! 👋')
  router.push('/login')
}
</script>

<style scoped>
.nav-top { background: transparent; }
.nav-scrolled {
  background: rgba(10,10,15,0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 4px 30px rgba(0,0,0,0.3);
}
.nav-link {
  @apply px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all duration-200;
}
.nav-link:hover { background: rgba(255,255,255,0.06); }
.nav-link-active {
  @apply text-white;
  background: rgba(99,102,241,0.15);
  color: #a5b4fc !important;
}
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
