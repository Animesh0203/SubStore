<template>
    <div>
      <div v-for="post in posts" :key="post.id">
        <h2>{{ post.title }}</h2>
        <p>{{ post.content }}</p>
        <h1>{{ post.authorUsername }}</h1>
        <button v-if="isAuthor(post)" @click="deletePost(post.id)">Delete</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useFirestore, useCollection, useCurrentUser } from 'vuefire'
  import { collection, deleteDoc, doc } from 'firebase/firestore'
  
  const db = useFirestore()
  const posts = useCollection(collection(db, 'posts'))
  const user = useCurrentUser()
  
  const isAuthor = (post) => user.value && post.authorId === user.value.uid
  
  const deletePost = async (id) => {
    await deleteDoc(doc(db, 'posts', id))
  }
  </script>