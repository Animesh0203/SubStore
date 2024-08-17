<template>
    <div v-if="show" class="modal">
      <div class="modal-content">
        <h2>Choose a Username</h2>
        <input v-model="username" placeholder="Enter a unique username" />
        <p v-if="error">{{ error }}</p>
        <button @click="submitUsername">Submit</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
    show: Boolean,
  })
  
  const emit = defineEmits(['close', 'submit'])
  
  const username = ref('')
  const error = ref('')
  
  const submitUsername = () => {
    if (username.value.trim() === '') {
      error.value = 'Username cannot be empty'
      return
    }
  
    emit('submit', username.value)
  }
  
  watch(() => props.show, (newValue) => {
    if (newValue) {
      username.value = ''
      error.value = ''
    }
  })
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }
  </style>
  