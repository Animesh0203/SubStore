<template>
  <div>
    <header class="bg-offwhite shadow-lg relative z-20">
      <nav class="container mx-auto flex items-center justify-between p-4 z-2">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex justify-start items-center text-fresh-green font-bold text-xl"
        >
          <img src="../assets/logo/logo.png" alt="Logo" class="h-12 w-auto" />
        </NuxtLink>

        <!-- Hamburger Icon -->
        <div class="block lg:hidden">
          <button
            @click="toggleMenu"
            class="text-fresh-green focus:outline-none"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Side Panel for Mobile -->
        <div
          :class="{ block: isMenuOpen, hidden: !isMenuOpen }"
          class="fixed inset-0 bg-offwhite bg-opacity-90 z-50 lg:hidden"
        >
          <div class="flex flex-col h-full p-4">
            <button
              @click="toggleMenu"
              class="self-end text-fresh-green text-2xl"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <div class="flex flex-col mt-8 space-y-4">
              <NuxtLink
                to="/"
                class="nav-link-mobile"
                :class="{ 'active-link-mobile': $route.path === '/' }"
                @click="toggleMenu"
              >
                Home
              </NuxtLink>
              <NuxtLink
                to="/Login"
                class="nav-link-mobile"
                :class="{ 'active-link-mobile': $route.path === '/Login' }"
                @click="toggleMenu"
              >
                Login
              </NuxtLink>
              <NuxtLink
                to="/PostForm"
                class="nav-link-mobile"
                :class="{ 'active-link-mobile': $route.path === '/PostForm' }"
                @click="toggleMenu"
              >
                Create Your Sub
              </NuxtLink>
              <NuxtLink
                to="/Leaderboard"
                class="nav-link-mobile"
                :class="{
                  'active-link-mobile': $route.path === '/Leaderboard',
                }"
                @click="toggleMenu"
              >
                Leaderboard
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Navigation Links for Desktop -->
        <div class="hidden lg:flex lg:space-x-6 lg:items-center lg:ml-auto">
          <NuxtLink
            to="/"
            class="nav-link"
            :class="{ 'active-link': $route.path === '/' }"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/PostForm"
            class="nav-link"
            :class="{ 'active-link': $route.path === '/PostForm' }"
          >
            Create Your Sub
          </NuxtLink>
          <NuxtLink
            to="/Leaderboard"
            class="nav-link"
            :class="{ 'active-link': $route.path === '/Leaderboard' }"
          >
            Leaderboard
          </NuxtLink>
          <button @click="handleAuth" class="nav-link">
            {{ isLoggedIn ? "Logout" : "Login" }}
          </button>
        </div>
      </nav>
    </header>

    <div>
      <slot />
    </div>

    <!-- Only show the modal if the user doesn't already have a username -->
    <UsernameModal
      v-if="showModal"
      :show="showModal"
      @submit="handleUsernameSubmit"
    />

    <footer class="bg-fresh-green text-white py-6">
      <div class="container mx-auto text-white px-4">
        <div
          class="flex flex-col text-white md:flex-row justify-between items-center"
        >
          <div class="mb-4 text-white md:mb-0">
            <h2 class="text-2xl text-white font-bold">Disclaimer</h2>
            <p class="text-white mt-1">
              This website is a fan-based platform where users can share and
              explore creative Subway sandwich combinations. We are not
              affiliated with Subway® or its parent company in any way. All
              trademarks, logos, and brand names are the property of their
              respective owners. The use of similar colors or themes is for
              creative purposes only and does not imply any endorsement or
              association with Subway®.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useFirebaseAuth, useFirestore } from "vuefire";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import UsernameModal from "~/components/UsernameModal.vue";
import { useRouter } from "vue-router";

const isMenuOpen = ref(false);
const showModal = ref(false);
const isLoggedIn = ref(false);
const auth = useFirebaseAuth();
const db = useFirestore();
const router = useRouter();
let currentUser = null;

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleAuth = async () => {
  if (isLoggedIn.value) {
    // Log the user out
    await signOut(auth);
    isLoggedIn.value = false;
    navigateTo("/"); // Navigate to home after logout
  } else {
    // Log the user in
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      isLoggedIn.value = true;

      // Fetch the user's profile data (ensure user is logged in)
      if (user.value) {
        navigateTo({
          name: "users-username",
          params: { username: user.value.displayName },
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  }
};

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    currentUser = result.user;
    isLoggedIn.value = true;

    // Check if the user already has a username
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().username) {
      // User already has a username, redirect to PostForm
      router.push("/PostForm");
    } else {
      // Show the username modal
      showModal.value = true;
    }
  } catch (error) {
    console.error("Login error:", error);
  }
};

const logmeout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
    isLoggedIn.value = false;
    router.push("/Login");
  } catch (error) {
    console.error("Sign out error:", error);
  }
};

const handleUsernameSubmit = async (username) => {
  const userDocRef = doc(db, "users", currentUser.uid);

  // If the user doesn't have a username, proceed with the username check
  const usernamesQuery = query(
    collection(db, "users"),
    where("username", "==", username)
  );
  const usernamesSnapshot = await getDocs(usernamesQuery);

  if (!usernamesSnapshot.empty) {
    alert("Username is already taken, please choose another one.");
    return;
  }

  // Save the username to Firestore under the user's document
  await setDoc(userDocRef, {
    username: username,
    email: currentUser.email,
  });

  // Close the modal
  showModal.value = false;

  // Redirect to PostForm
  router.push("/PostForm");
};

// Watch the auth state to update isLoggedIn
watchEffect(() => {
  isLoggedIn.value = !!auth.currentUser;
});
</script>


<style scoped>
/* Tailwind CSS Utility Classes */
.bg-offwhite {
  background-color: #f8f8f8; /* Off-white color */
}

.text-fresh-green-dark {
  color: #148a2b; /* Darker fresh green color */
}

.border-green-500 {
  border-color: #5a9e6f; /* Darker green border color */
}

.border-yellow {
  border-color: #ffc600;
}

.hover\:bg-fresh-green-dark:hover {
  background-color: #148a2b; /* Darker green background on hover */
}

.text-offwhite {
  color: #f8f8f8; /* Off-white text color */
}

/* Navigation Link Styling */
.nav-link {
  @apply text-fresh-green px-3 py-2 border-2 text-sm font-medium rounded transition-colors duration-300;
}

.nav-link:hover {
  @apply bg-fresh-green text-offwhite;
}

.active-link {
  @apply bg-fresh-green text-offwhite;
}

/* Navigation Link Styling for Mobile Side Panel */
.nav-link-mobile {
  @apply text-fresh-green py-3 px-4 text-lg font-medium transition-colors duration-300;
}

.nav-link-mobile:hover {
  @apply bg-fresh-green text-offwhite;
}

.active-link-mobile {
  @apply bg-fresh-green text-offwhite;
}

/* Additional Styling */
header {
  @apply shadow-md;
}

.container {
  @apply max-w-screen-2xl;
}

h1 {
  @apply text-gray-800; /* Darker text for better readability */
}

button {
  @apply cursor-pointer outline-none;
}
</style>
