import { getCurrentUser } from 'vuefire'

export default defineNuxtRouteMiddleware(async (to) => {
  // List of public routes
  const publicRoutes = ['login', 'home', 'Leaderboard'] // Example routes that are public

  // Check if the route is public
  if (publicRoutes.includes(to.name)) {
    return; // Allow access to public routes
  }

  // Get the current user
  const user = await getCurrentUser()

  if (!user) {
    return navigateTo('/login');
  }

  // Redirect logged-in users away from the login page
  // if (user && to.name === 'u') {
  //   return navigateTo('')
  // }

  if (user && to.name === 'login') {
    return navigateTo('/Leaderboard')
  }

  if (user && to.name === 'PostList') {
    return navigateTo('/Leaderboard')
  }

  // Redirect not logged-in users to the login page if they try to access a protected route
  if (!user && !publicRoutes.includes(to.name)) {
    return navigateTo('/login')
  }
})
