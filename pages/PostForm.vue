<template>
    <div>
      <button @click="logmeout">Logout!</button>
      <form @submit.prevent="submitPost">
        <input v-model="title" placeholder="Title" required />
        <textarea v-model="content" placeholder="Content" required></textarea>
        <button type="submit">Submit Post</button>
      </form>
    </div>
  </template>
    
  <script setup>
  import { ref } from "vue";
  import { useFirestore, useCurrentUser } from "vuefire";
  import { collection, addDoc, doc, getDoc } from "firebase/firestore";
  import { signOut } from "firebase/auth";
  import { useFirebaseAuth } from "vuefire";
  import { navigateTo } from 'nuxt/app'; // Ensure navigateTo is correctly imported
  
  const auth = useFirebaseAuth();
  
  async function logmeout() {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      // Redirect to the login page after logout
      navigateTo('/login');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }
  
  const db = useFirestore();
  const user = useCurrentUser();
  
  const title = ref("");
  const content = ref("");
  
  const submitPost = async () => {
    if (!user.value) return;
  
    // Retrieve the user's document to get the username
    const userDoc = await getDoc(doc(db, "users", user.value.uid));
    const username = userDoc.exists() ? userDoc.data().username : "Unknown User";
  
    await addDoc(collection(db, "posts"), {
      title: title.value,
      content: content.value,
      authorUsername: username, // Use the username instead of authorId
      createdAt: new Date(),
    });
  
    title.value = "";
    content.value = "";
  };
  </script>
  
  