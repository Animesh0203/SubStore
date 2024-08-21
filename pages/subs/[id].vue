<template>
  <div class="flex flex-col items-center py-8">
    <div v-for="post in sortedPosts" :key="post.id" class="w-full max-w-6xl bg-white border-2 border-fresh-green shadow-lg p-6 mb-6">
      <h2 class="text-2xl font-semibold text-fresh-green mb-2">{{ post.title }}</h2>
      <p class="text-gray-700 mb-4">{{ post.content }}</p>
      <h3 class="text-sm text-gray-500 mb-4">Posted by: {{ post.authorUsername }}</h3>

      <!-- Display additional data options -->
      <div class="mb-4">
        <div v-if="post.multipleOptions && post.multipleOptions.length > 0" class="mb-2">
          <h4 class="font-medium text-gray-600">Selected Options:</h4>
          <ul>
            <li v-for="option in post.multipleOptions" :key="option" class="text-gray-700">- {{ option }}</li>
          </ul>
        </div>
        <div v-if="post.singleOption" class="mb-2">
          <h4 class="font-medium text-gray-600">Single Option:</h4>
          <p class="text-gray-700">{{ post.singleOption }}</p>
        </div>
        <div v-if="post.toggleOption !== undefined" class="mb-2">
          <h4 class="font-medium text-gray-600">Toggle Option:</h4>
          <p class="text-gray-700">{{ post.toggleOption ? 'On' : 'Off' }}</p>
        </div>
      </div>

      <!-- Upvote and Delete buttons -->
      <div class="flex items-center justify-between">
        <button 
          @click="upvotePost(post.id)" 
          class="flex items-center space-x-1 text-fresh-green hover:text-green-700"
          :disabled="hasUpvoted(post)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 10a7 7 0 1114 0A7 7 0 013 10zm7-4a1 1 0 011 1v6a1 1 0 01-2 0V7a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>{{ post.upvotes || 0 }}</span>
        </button>

        <button v-if="isAuthor(post)" @click="deletePost(post.id)" class="text-red-500 hover:text-red-700">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFirestore, useCollection, useCurrentUser } from 'vuefire'
import { collection, deleteDoc, doc, updateDoc, increment, arrayUnion, getDoc } from 'firebase/firestore'

const db = useFirestore()
const posts = useCollection(collection(db, 'posts'))
const user = useCurrentUser()

const isAuthor = (post) => user.value && post.authorId === user.value.uid

const deletePost = async (id) => {
  try {
    await deleteDoc(doc(db, 'posts', id))
  } catch (error) {
    console.error('Error deleting post:', error)
  }
}

// Function to upvote a post
const upvotePost = async (id) => {
  if (!user.value) {
    console.error('User must be logged in to upvote.')
    return
  }

  const postRef = doc(db, 'posts', id)
  try {
    // Fetch the current post to check if user has already upvoted
    const postDoc = await getDoc(postRef)
    const postData = postDoc.data()
    
    if (postData.voters && postData.voters.includes(user.value.uid)) {
      console.error('User has already upvoted this post.')
      return
    }

    // Add the user to the voters array and increment upvotes
    await updateDoc(postRef, {
      upvotes: increment(1),
      voters: arrayUnion(user.value.uid)
    })
  } catch (error) {
    console.error('Error upvoting post:', error)
  }
}

// Check if the current user has upvoted the post
const hasUpvoted = (post) => post.voters && post.voters.includes(user.value.uid)

// Sort posts by upvotes in descending order
const sortedPosts = computed(() => {
  return (posts.value || []).slice().sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
})
</script>