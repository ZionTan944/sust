import { defineStore } from 'pinia'
import { loginUser } from '../services/login.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null
  }),

  getters: {
    currentUser: (state) => state.user,
    isAuthenticated: (state) => state.isLoggedIn && state.user !== null,
    userFaculty: (state) => state.user?.faculty || null,
    userName: (state) => state.user?.username || null,
    userEmail: (state) => state.user?.email || null
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const response = await loginUser(email, password)
        
        if (response && response.user) {
          this.user = response.user
          this.isLoggedIn = true
          
          // Store in localStorage for persistence across browser sessions
          localStorage.setItem('user', JSON.stringify(response.user))
          localStorage.setItem('isLoggedIn', 'true')
          
          return { success: true, user: response.user }
        } else {
          throw new Error('Invalid response from server')
        }
      } catch (error) {
        this.error = error.message
        this.user = null
        this.isLoggedIn = false
        
        // Clear localStorage on failed login
        localStorage.removeItem('user')
        localStorage.removeItem('isLoggedIn')
        
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.isLoggedIn = false
      this.error = null
      
      // Clear localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
    },

    // Initialize user state from localStorage (for page refreshes)
    initializeAuth() {
      try {
        const storedUser = localStorage.getItem('user')
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn')
        
        if (storedUser && storedIsLoggedIn === 'true') {
          this.user = JSON.parse(storedUser)
          this.isLoggedIn = true
        }
      } catch (error) {
        console.error('Error initializing auth from localStorage:', error)
        // Clear corrupted localStorage data
        localStorage.removeItem('user')
        localStorage.removeItem('isLoggedIn')
      }
    },

    // Clear any errors
    clearError() {
      this.error = null
    }
  }
})