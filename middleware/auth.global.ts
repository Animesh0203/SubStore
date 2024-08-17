import { getCurrentUser } from 'vuefire'

export default defineNuxtRouteMiddleware(async (to) => {
  // List of public routes
  const publicRoutes = ['login', 'home', 'board'] // Example routes that are public

  // Check if the route is public
  if (publicRoutes.includes(to.name)) {
    return; // Allow access to public routes
  }

  // Get the current user
  const user = await getCurrentUser()

  // Redirect logged-in users away from the login page
  if (user && to.name === 'login') {
    return navigateTo('/board')
  }

  // Redirect not logged-in users to the login page if they try to access a protected route
  if (!user && !publicRoutes.includes(to.name)) {
    return navigateTo('/login')
  }
})
