<template>
    <div>
      <h1>Firebase Data Management with VueFire</h1>
  
      <!-- Create new data -->
      <form @submit.prevent="createData">
        <input v-model="newData.title" placeholder="Title" required />
        <input v-model="newData.content" placeholder="Content" required />
        <button type="submit">Create Data</button>
      </form>
  
      <!-- Display all data -->
      <div v-for="item in data" :key="item.id">
        <div v-if="editingId === item.id">
          <!-- Editing mode -->
          <input v-model="item.title" placeholder="Title" required />
          <input v-model="item.content" placeholder="Content" required />
          <button @click="saveData(item)">Save</button>
          <button @click="cancelEdit">Cancel</button>
        </div>
        <div v-else>
          <!-- Display mode -->
          <h3>{{ item.title }}</h3>
          <p>{{ item.content }}</p>
          <button @click="editData(item)">Update</button>
          <button @click="deleteData(item.id)">Delete</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useCollection } from 'vuefire'
  import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
  import { useNuxtApp } from '#app'
  
  const { $firestore } = useNuxtApp()
  const dataCollection = collection($firestore, 'data')
  const data = useCollection(dataCollection)
  
  const newData = ref({ title: '', content: '' })
  const editingId = ref(null)
  
  const createData = async () => {
    try {
      await addDoc(dataCollection, newData.value)
      newData.value = { title: '', content: '' }
    } catch (error) {
      console.error('Error creating data:', error)
    }
  }
  
  const editData = (item) => {
    editingId.value = item.id
  }
  
  const saveData = async (item) => {
    try {
      const docRef = doc($firestore, 'data', item.id)
      await updateDoc(docRef, {
        title: item.title,
        content: item.content,
      })
      editingId.value = null // Exit editing mode
    } catch (error) {
      console.error('Error updating data:', error)
    }
  }
  
  const cancelEdit = () => {
    editingId.value = null
  }
  
  const deleteData = async (id) => {
    try {
      const docRef = doc($firestore, 'data', id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }
  </script>
  