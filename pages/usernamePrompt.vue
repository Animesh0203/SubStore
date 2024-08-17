<!-- components/UsernamePrompt.vue -->
<template>
    <div v-if="showUsernamePrompt">
      <h2>Choose a Username</h2>
      <input v-model="username" placeholder="Enter a unique username" />
      <button @click="saveUsername">Save</button>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useNuxtApp } from '#app'
  import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore'
  
  const { $firestore, $auth } = useNuxtApp()
  const username = ref('')
  const error = ref('')
  const showUsernamePrompt = ref(true)
  
  const saveUsername = async () => {
    try {
      const usernamesRef = collection($firestore, 'usernames')
      const q = query(usernamesRef, where('username', '==', username.value))
      const querySnapshot = await getDocs(q)
  
      if (querySnapshot.empty) {
        // Save username
        const userDoc = doc($firestore, 'users', $auth.currentUser.uid)
        await setDoc(userDoc, { username: username.value }, { merge: true })
  
        // Save the username to the usernames collection for uniqueness check
        const usernameDoc = doc($firestore, 'usernames', username.value)
        await setDoc(usernameDoc, { uid: $auth.currentUser.uid })
  
        showUsernamePrompt.value = false
      } else {
        error.value = 'Username already exists, please choose another one.'
      }
    } catch (err) {
      console.error('Error saving username:', err)
    }
  }
  </script>
  