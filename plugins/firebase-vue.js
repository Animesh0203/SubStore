import { defineNuxtPlugin } from '#app'
import { initializeApp, getApps } from 'firebase/app'
import { VueFire } from 'vuefire'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin((nuxtApp) => {
    let firebaseApp;
    if (process.client) {
    // Check if Firebase app is already initialized
        if (!getApps().length) {
            firebaseApp = initializeApp({
//Your Keys
            });
        } else {
            firebaseApp = getApps()[0]; // Get the already initialized app
        }

        const auth = getAuth(firebaseApp);
        const firestore = getFirestore(firebaseApp);

        setPersistence(auth, browserLocalPersistence);

        nuxtApp.vueApp.use(VueFire, {
            firebaseApp,
        });

        nuxtApp.provide('firestore', firestore);
    }
})
