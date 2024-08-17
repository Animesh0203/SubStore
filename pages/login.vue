<template>
    <div>
      <h1>Login</h1>
      <button @click="loginWithGoogle">Login with Google</button>
  
      <UsernameModal v-if="showModal" :show="showModal" @submit="handleUsernameSubmit" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useFirebaseAuth, useFirestore } from 'vuefire'
  import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
  import { doc, setDoc, getDocs, query, collection, where } from 'firebase/firestore'
  import UsernameModal from '~/components/UsernameModal.vue'
  
  const auth = useFirebaseAuth()
  const db = useFirestore()
  const showModal = ref(false)
  let currentUser = null
  
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      currentUser = result.user
  
      // Show the username modal
      showModal.value = true
    } catch (error) {
      console.error('Login error:', error)
    }
  }
  
  const handleUsernameSubmit = async (username) => {
    // Check if the username is unique
    const usernamesQuery = query(collection(db, 'users'), where('username', '==', username))
    const usernamesSnapshot = await getDocs(usernamesQuery)
  
    if (!usernamesSnapshot.empty) {
      alert('Username is already taken, please choose another one.')
      return
    }
  
    // Save the username to Firestore under the user's document
    await setDoc(doc(db, 'users', currentUser.uid), {
      username: username,
      email: currentUser.email,
    })
  
    // Close the modal
    showModal.value = false
  
    // Redirect to PostForm
    navigateTo('/PostForm')
  }
  </script>
  