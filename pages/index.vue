<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-green-50">
    <div class="bg-white p-8 rounded-none shadow-lg w-full max-w-sm text-center">
      <h1 class="text-3xl font-bold text-green-600 mb-6">Login</h1>
      <button
        @click="login"
        class="w-full bg-green-600 text-white py-2 px-4 rounded-none hover:bg-green-700 transition-colors duration-300"
      >
        Login with Google
      </button>
    </div>
  </div>
</template>
  
  <script setup>
  import { useNuxtApp } from '#app'
  import { useRouter } from 'vue-router'
  
  const { $signInWithGoogle, $auth } = useNuxtApp()
  const router = useRouter()
  
  const login = async () => {
    try {
      await $signInWithGoogle()
      router.push('/profile')
    } catch (error) {
      console.error('Error logging in:', error)
    }
  }
  </script>
  