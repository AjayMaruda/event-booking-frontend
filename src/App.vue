<template>
  <div class="min-h-screen">
    <Navbar v-if="showNavbar" />
    <main :class="showNavbar ? 'pt-20' : ''">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
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
.page-enter-active, .page-leave-active { transition: all 0.25s ease; }
.page-enter-from { opacity: 0; transform: translateY(12px); }
.page-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>
