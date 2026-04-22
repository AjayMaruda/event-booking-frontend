<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background: radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%);">
    <div class="text-center">
      <p class="text-9xl font-black text-transparent bg-clip-text mb-6" style="background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3)); -webkit-background-clip: text;">404</p>
      <h1 class="text-3xl font-black text-white mb-3">Page Not Found</h1>
      <p class="text-white/40 mb-10">The page you're looking for doesn't exist.</p>
      <RouterLink to="/events" class="btn-primary px-10 py-3.5 text-base">Go to Events</RouterLink>
    </div>
  </div>
</template>
