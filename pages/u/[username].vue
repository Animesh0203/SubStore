<template>
  <div class="container mx-auto p-4">
    <!-- Only display the profile if userProfile is not null -->
    <div v-if="userProfile">
      <h1 class="text-3xl font-bold mb-4">{{ userProfile.username }}'s Profile</h1>

      <!-- Section to add new post (only visible to the profile owner) -->
      <div v-if="isOwner" class="mb-6">
        <div>
        <PostForm />
        <!-- <h2 class="text-2xl font-semibold">Add a New Post</h2>
        <form @submit.prevent="submitPost">
          <input
            v-model="newPostTitle"
            placeholder="Title"
            class="border p-2 w-full mb-2"
            required
          />
          <textarea
            v-model="newPostContent"
            placeholder="Content"
            class="border p-2 w-full mb-2"
            required
          ></textarea>
          <button type="submit" class="bg-green-500 text-white p-2 rounded">Submit</button>
        </form> -->
      </div>
      </div>

      <div class="mb-4">
        <h2 class="text-2xl font-semibold">Posts</h2>
        <div v-if="userPosts.length">
          <div
            v-for="post in userPosts"
            :key="post.id"
            class="border p-4 my-2 relative"
          >
            <h3 class="text-xl font-semibold">{{ post.title }}</h3>
            <p>{{ post.content }}</p>
            <!-- Show delete button only if the logged-in user is the owner -->
            <button
              v-if="isOwner"
              @click="deletePost(post.id)"
              class="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
        <div v-else>
          <p>No posts found.</p>
        </div>
      </div>
    </div>

    <!-- Display a loading or error message while fetching data -->
    <div v-else>
      <p>Loading profile...</p>
    </div>
  </div>
</template>

<script setup>
import PostForm from '../PostForm.vue';
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useFirestore, useCurrentUser } from 'vuefire';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const route = useRoute();
const db = useFirestore();
const user = useCurrentUser();

const userProfile = ref(null);
const userPosts = ref([]);
const newPostTitle = ref("");
const newPostContent = ref("");
console.log('Hello')
// Check if the current user is the owner of the profile
const isOwner = computed(() => user.value && userProfile.value && user.value.uid === userProfile.value.uid);

onMounted(async () => {
  const username = route.params.username;

  // Fetch the user's document by username
  const usersCollection = collection(db, 'users');
  const userQuery = query(usersCollection, where('username', '==', username));
  const userSnapshot = await getDocs(userQuery);

  if (!userSnapshot.empty) {
    const userDoc = userSnapshot.docs[0];
    userProfile.value = userDoc.data();
    userProfile.value.uid = userDoc.id; // Save the user's UID

    // Fetch the user's posts
    const postsCollection = collection(db, 'posts');
    const postsQuery = query(postsCollection, where('authorUsername', '==', username));
    const postsSnapshot = await getDocs(postsQuery);
    
    userPosts.value = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
});

// Function to submit a new post (only available for profile owner)
const submitPost = async () => {
  if (!isOwner.value) return;

  await addDoc(collection(db, "posts"), {
    title: newPostTitle.value,
    content: newPostContent.value,
    authorUsername: userProfile.value.username,
    authorId: userProfile.value.uid,
    createdAt: new Date(),
  });

  newPostTitle.value = "";
  newPostContent.value = "";

  // Refresh posts after submission
  onMounted();
};

// Function to delete a post (only available for profile owner)
const deletePost = async (id) => {
  if (!isOwner.value) return;

  await deleteDoc(doc(db, 'posts', id));

  // Refresh posts after deletion
  userPosts.value = userPosts.value.filter(post => post.id !== id);
};

</script>
