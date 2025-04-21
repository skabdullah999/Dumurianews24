import { supabase } from "./supabase"

/**
 * Authenticate a user with email and password
 */
export async function login(email: string, password: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error.message)
      return false
    }

    return true
  } catch (error) {
    console.error("Login error:", error)
    return false
  }
}

/**
 * Log out the current user
 */
export async function logout(): Promise<void> {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error("Logout error:", error)
  }
}

/**
 * Check if a user is currently authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data } = await supabase.auth.getSession()
    return !!data.session
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}

/**
 * Get the current user's information
 */
export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser()
    return data.user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
