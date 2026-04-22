<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar v-if="showNavbar" />
    <main :class="showNavbar ? 'pt-16' : ''">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <Toast />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Toast from './components/ui/Toast.vue'

const route = useRoute()
const showNavbar = computed(() => !['Login', 'Register'].includes(route.name))
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
