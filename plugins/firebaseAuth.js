// plugins/firebaseAuth.js
import { defineNuxtPlugin } from '#app'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useNuxtApp } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    const auth = getAuth()
    nuxtApp.provide('auth', auth)

    nuxtApp.provide('signInWithGoogle', () => {
        const provider = new GoogleAuthProvider()
        provider.addScope('https://www.googleapis.com/auth/userinfo.email')
        provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
        return signInWithPopup(auth, provider)
    })
})
