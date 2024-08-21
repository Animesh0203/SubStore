<template>
  <div class="relative min-h-screen flex items-center justify-center bg-offwhite overflow-hidden">
    <!-- Background Shapes -->
    <div class="absolute top-0 left-0 w-1/2 h-1/2 bg-green-100 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-7/10 h-7/10 bg-green-100 rounded-full transform translate-x-1/2 translate-y-1/2"></div>

    <div class="relative z-10 text-center bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-fresh-green mb-6">Login</h1>
      <button @click="loginWithGoogle" class="bg-fresh-green text-white px-6 py-3 rounded-lg font-medium text-lg hover:bg-green-700 transition-colors duration-300">
        Login with Google
      </button>

      <!-- Only show the modal if the user doesn't already have a username -->
      <UsernameModal v-if="showModal" :show="showModal" @submit="handleUsernameSubmit" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFirebaseAuth, useFirestore } from 'vuefire'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, query, collection, where, getDocs } from 'firebase/firestore'
import UsernameModal from '~/components/UsernameModal.vue'
import { useRouter } from 'vue-router'

const auth = useFirebaseAuth()
const db = useFirestore()
const showModal = ref(false)
const router = useRouter()
let currentUser = null

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider())
    currentUser = result.user

    // Check if the user already has a username
    const userDocRef = doc(db, 'users', currentUser.uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists() && userDoc.data().username) {
      // User already has a username, redirect to PostForm
      router.push('/PostForm')
    } else {
      // Show the username modal
      showModal.value = true
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}

const handleUsernameSubmit = async (username) => {
  const userDocRef = doc(db, 'users', currentUser.uid)

  // If the user doesn't have a username, proceed with the username check
  const usernamesQuery = query(collection(db, 'users'), where('username', '==', username))
  const usernamesSnapshot = await getDocs(usernamesQuery)

  if (!usernamesSnapshot.empty) {
    alert('Username is already taken, please choose another one.')
    return
  }

  // Save the username to Firestore under the user's document
  await setDoc(userDocRef, {
    username: username,
    email: currentUser.email,
  })

  // Close the modal
  showModal.value = false

  // Redirect to PostForm
  router.push('/PostForm')
}
</script>

<style scoped>
/* Scoped styles for additional tweaks, if necessary */
</style>
