<template>
  <div class="max-w-screen mx-auto p-6 bg-white shadow-md">
    <h1 class="text-2xl font-semibold text-gray-800 mb-4">Create your Sub!</h1>

    <form @submit.prevent="submitPost" class="space-y-4 mt-6">
      <!-- Title -->
      <input
        v-model="title"
        placeholder="Name Your Creation"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <!-- Multiple Checkboxes -->
      <div class="space-y-2">
        <h2 class="text-lg font-semibold text-gray-700">Select Options:</h2>
        <div class="flex items-center">
          <input type="checkbox" id="option1" value="Option 1" v-model="selectedOptions" class="mr-2">
          <label for="option1" class="text-gray-600">Option 1</label>
        </div>
        <div class="flex items-center">
          <input type="checkbox" id="option2" value="Option 2" v-model="selectedOptions" class="mr-2">
          <label for="option2" class="text-gray-600">Option 2</label>
        </div>
        <div class="flex items-center">
          <input type="checkbox" id="option3" value="Option 3" v-model="selectedOptions" class="mr-2">
          <label for="option3" class="text-gray-600">Option 3</label>
        </div>
      </div>

      <!-- Single Checkbox Selection -->
      <div class="space-y-2">
        <h2 class="text-lg font-semibold text-gray-700">Select One:</h2>
        <div class="flex items-center">
          <input type="radio" name="singleOption" id="single1" value="Single 1" v-model="singleOption" class="mr-2">
          <label for="single1" class="text-gray-600">Single 1</label>
        </div>
        <div class="flex items-center">
          <input type="radio" name="singleOption" id="single2" value="Single 2" v-model="singleOption" class="mr-2">
          <label for="single2" class="text-gray-600">Single 2</label>
        </div>
      </div>

      <!-- Additional Text Input -->
      <div>
        <h2 class="text-lg font-semibold text-gray-700">Additional Info:</h2>
        <input
          v-model="additionalInfo"
          placeholder="Type here..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <!-- Toggle Button -->
      <div class="flex items-center">
        <span class="text-gray-700 mr-2">Enable Feature:</span>
        <input
          type="checkbox"
          v-model="featureEnabled"
          class="toggle-checkbox h-6 w-12 rounded-full bg-gray-300 border-2 border-gray-400 transition-colors duration-300 ease-in-out"
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
      >
        Submit Post
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useFirestore, useCurrentUser } from "vuefire";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";
import { navigateTo } from 'nuxt/app';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library for unique IDs

const auth = useFirebaseAuth();

async function logmeout() {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
    navigateTo('/login');
  } catch (error) {
    console.error("Sign out error:", error);
  }
}

const db = useFirestore();
const user = useCurrentUser();

const title = ref("");
const content = ref("");
const additionalInfo = ref("");
const featureEnabled = ref(false);
const selectedOptions = ref([]);
const singleOption = ref("");

const submitPost = async () => {
  if (!user.value) return;

  const userDoc = await getDoc(doc(db, "users", user.value.uid));
  const username = userDoc.exists() ? userDoc.data().username : "Unknown User";

  await addDoc(collection(db, "posts"), {
    id: uuidv4(), // Generate a unique ID for each post
    title: title.value,
    // content: content.value,
    additionalInfo: additionalInfo.value,
    featureEnabled: featureEnabled.value,
    selectedOptions: selectedOptions.value, // Save the selected options
    singleOption: singleOption.value, // Save the selected single option
    authorUsername: username,
    createdAt: new Date(),
  });

  title.value = "";
  content.value = "";
  additionalInfo.value = "";
  featureEnabled.value = false;
  selectedOptions.value = [];
  singleOption.value = "";
};
</script>
