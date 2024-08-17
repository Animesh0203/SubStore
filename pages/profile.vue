<!-- pages/profile.vue -->
<template>
    <div v-if="user">
      <UsernamePrompt v-if="!hasUsername" />
      <div v-else>
        <h1>Your Profile</h1>
        <div v-for="submission in submissions" :key="submission.id">
          <h3>Submission at {{ submission.timestamp.toDate() }}</h3>
          <ul>
            <li v-for="option in submission.options" :key="option">{{ option }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <p>You need to be logged in to view your profile.</p>
      <button @click="redirectToLogin">Login</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useNuxtApp } from '#app'
  import { useRouter } from 'vue-router'
  import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
  import UsernamePrompt from '~/pages/usernamePrompt.vue'
  
  const { $firestore, $auth } = useNuxtApp()
  const router = useRouter()
  
  const submissions = ref([])
  const user = ref(null)
  const hasUsername = ref(false)
  
  onMounted(async () => {
    user.value = $auth.currentUser
    if (user.value) {
      const userDoc = doc($firestore, 'users', user.value.uid)
      const userSnapshot = await getDoc(userDoc)
      if (userSnapshot.exists() && userSnapshot.data().username) {
        hasUsername.value = true
        const userSubmissions = collection($firestore, 'users', user.value.uid, 'submissions')
        const querySnapshot = await getDocs(userSubmissions)
        submissions.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      }
    }
  })
  
  const redirectToLogin = () => {
    router.push('/login')
  }
  </script>
  