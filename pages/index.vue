<template>
  <div>
    <h1>Click to Login</h1>
    <button @click="loginWithGoogle" class="rounded-lg">Click on this to Login</button>
  </div>
</template>

<script setup>
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const auth = useFirebaseAuth()
const router = useRouter()

function loginWithGoogle(){
    signInWithPopup(auth, new GoogleAuthProvider())
        .then(() => router.replace('/PostForm'))
}
</script>

<style>
</style>