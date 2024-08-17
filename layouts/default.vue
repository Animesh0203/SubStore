<template>
  <div>
    <header class="bg-offwhite shadow-md">
  <nav class="container mx-auto flex items-center justify-between p-4">
    <!-- Logo -->
    <NuxtLink to="/" class="flex items-center text-fresh-green font-bold text-lg">
      <img src="" alt="Logo" class="h-8 w-auto" />
      <span class="ml-2">SubStore</span>
    </NuxtLink>

    <!-- Navigation Links -->
    <div class="flex space-x-4">
      <NuxtLink
        to="/"
        class="text-offwhite px-3 py-2 border-2 border-green-400 text-sm font-medium hover:bg-fresh-green hover:text-offwhite transition-colors"
        :class="{ 'bg-fresh-green text-offwhite': $route.path === '/' }"
      >
        Home
      </NuxtLink>
      <NuxtLink
        to="/Login"
        class="text-offwhite px-3 py-2 border-2 border-green-400 text-sm font-medium hover:bg-fresh-green hover:text-offwhite transition-colors"
        :class="{ 'bg-fresh-green text-offwhite': $route.path === '/Login' }"
      >
        Login
      </NuxtLink>
      <NuxtLink
        to="/PostForm"
        class="text-offwhite px-3 py-2 border-2 border-green-400 text-sm font-medium hover:bg-fresh-green hover:text-offwhite transition-colors"
        :class="{ 'bg-fresh-green text-offwhite': $route.path === '/PostForm' }"
      >
        Create Your Sub
      </NuxtLink>
      <NuxtLink
        to="/Leaderboard"
        class="text-offwhite px-3 py-2 border-2 border-green-400 text-sm font-medium hover:bg-fresh-green hover:text-offwhite transition-colors"
        :class="{ 'bg-fresh-green text-offwhite': $route.path === '/Leaderboard' }"
      >
        Leaderboard
      </NuxtLink>
    </div>
  </nav>
</header>

    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>