<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Leaderboard</h1>
      <div v-for="submission in sortedSubmissions" :key="submission.id" class="mb-4">
        <div class="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">{{ submission.username }}</h3>
            <p class="text-gray-600">{{ submission.options.join(', ') }}</p>
          </div>
          <div class="text-right">
            <p class="text-green-600 font-bold">{{ submission.votes }} votes</p>
            <button
              @click="upvote(submission)"
              class="bg-green-600 text-white py-1 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              Upvote
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useNuxtApp } from '#app'
import { collection, getDocs, updateDoc, doc, increment, query, orderBy } from 'firebase/firestore'

const { $firestore, $auth } = useNuxtApp()
const submissions = ref([])

onMounted(async () => {
  const submissionsRef = collection($firestore, 'users')
  const submissionsQuery = query(submissionsRef, orderBy('votes', 'desc'))
  const querySnapshot = await getDocs(submissionsQuery)

  const submissionPromises = querySnapshot.docs.map(async (userDoc) => {
    const submissionsCollection = collection(userDoc.ref, 'submissions')
    const submissionSnapshot = await getDocs(submissionsCollection)

    return submissionSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      username: userDoc.data().username,
      userId: userDoc.id, // Store the userId for reference in upvote
      votes: doc.data().votes || 0
    }))
  })

  const resolvedSubmissions = await Promise.all(submissionPromises)
  submissions.value = resolvedSubmissions.flat()
})

const sortedSubmissions = computed(() => {
  return submissions.value.sort((a, b) => b.votes - a.votes)
})

const upvote = async (submission) => {
  console.log('Attempting to upvote:', submission)
  if ($auth.currentUser) {
    try {
      const submissionRef = doc($firestore, 'users', submission.userId, 'submissions', submission.id)
      console.log('Document reference:', submissionRef)
      await updateDoc(submissionRef, { votes: increment(1) })
      submission.votes += 1
    } catch (error) {
      console.error('Error upvoting:', error)
    }
  } else {
    console.error('You need to be logged in to upvote.')
  }
}
</script>

<style scoped>
/* Add any additional styling here */
</style>
