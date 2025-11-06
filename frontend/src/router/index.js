import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import OperatorView from '../views/OperatorView.vue'
import OperatorDetailView from '../views/OperatorDetailView.vue'
import ProfileView from '../views/ProfileView.vue'
import LeaderboardView from '../views/LeaderboardView.vue'
import { useUserStore } from '../stores/user.js'
import RewardView from '@/views/RewardView.vue'
import CameraView from '@/views/CameraView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: OperatorView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/operator',
      name: 'operator',
      component: OperatorView,
      meta: { requiresAuth: true }
    },
    {
      path: '/operator/:id',
      name: 'operator-detail',
      component: OperatorDetailView,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: LeaderboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/rewards',
      name: 'rewards',
      component: RewardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/camera',
      name: 'camera',
      component: CameraView,
      meta: { requiresAuth: true }
    },
  ],
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is authenticated
    if (!userStore.isAuthenticated) {
      // Redirect to login page
      next({ name: 'login' })
    } else {
      next() // User is authenticated, proceed
    }
  } else {
    // Route doesn't require auth, proceed
    next()
  }
})

export default router
