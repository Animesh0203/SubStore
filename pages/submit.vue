<template>
  <div class="min-h-screen bg-green-50 flex items-center justify-center">
    <div v-if="user" class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-green-600 mb-6">Submit Data</h1>
      <form @submit.prevent="submitData">
        <!-- Name Input -->
        <div class="mb-4">
          <label class="block text-green-700 mb-2">Name</label>
          <input
            v-model="name"
            type="text"
            placeholder="Enter your name"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
          />
        </div>

        <!-- Multi-Select Input -->
        <div class="mb-4">
          <label class="block text-green-700 mb-2">Choose Multiple Options</label>
          <select
            v-model="selectedMultiOptions"
            multiple
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
          >
            <option v-for="option in options" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Single-Select Input -->
        <div class="mb-4">
          <label class="block text-green-700 mb-2">Choose an Option</label>
          <select
            v-model="selectedSingleOption"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
          >
            <option v-for="option in options" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
        >
          Submit
        </button>
      </form>
    </div>
    <div v-else class="text-center p-8 bg-white rounded-lg shadow-lg">
      <p class="text-lg text-green-700 mb-4">You need to be logged in to submit data.</p>
      <button
        @click="redirectToLogin"
        class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
      >
        Login
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { useRouter } from 'vue-router'
import { collection, addDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const { $firestore, $auth } = useNuxtApp()
const router = useRouter()

// Data options
const options = ref([
  { id: 'option1', label: 'Option 1' },
  { id: 'option2', label: 'Option 2' },
  { id: 'option3', label: 'Option 3' },
])

const name = ref('')
const selectedMultiOptions = ref([])
const selectedSingleOption = ref(null)
const user = ref(null)

onMounted(() => {
  onAuthStateChanged($auth, (firebaseUser) => {
    user.value = firebaseUser
  })
})

const submitData = async () => {
  if (user.value) {
    try {
      const userDoc = collection($firestore, 'users', user.value.uid, 'submissions')
      await addDoc(userDoc, {
        name: name.value,
        multiOptions: selectedMultiOptions.value,
        singleOption: selectedSingleOption.value,
        timestamp: new Date(),
      })
      name.value = ''
      selectedMultiOptions.value = []
      selectedSingleOption.value = null
    } catch (error) {
      console.error('Error submitting data:', error)
    }
  }
}

const redirectToLogin = () => {
  router.push('/login')
}
</script>
