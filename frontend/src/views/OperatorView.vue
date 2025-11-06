<template>
  <div class="operator-container">
    <div class="container-fluid h-100">
      <div class="row h-100 justify-content-center align-items-stretch">
        <div class="d-flex flex-column flex-grow-1 p-0 min-vh-100">
          <!-- Header with Logout Button -->
          <div class="d-flex align-items-center justify-content-between px-3 pt-3 pb-5">
            <div>
              <div class="fw-bold fs-5 mb-1">Food Waste Leaderboard</div>
              <div class="text-muted small">{{ currentDate }}</div>
            </div>
            <LogoutButton @logout="handleLogout" />
          </div>
          <!-- Progress Bar Section (same width as card) -->
          <div class="progress-section col-12 col-md-8 mx-auto mb-3">
            <div class="progress-section-inner p-3">
              <div class="d-flex align-items-center mb-2">
                <font-awesome-icon icon="fa-solid fa-drumstick-bite" class="me-2 text-success" />
                <span class="fw-semibold">Total Food Waste Digested</span>
              </div>
              <div class="d-flex align-items-end mb-1">
                <span class="fw-bold display-6 me-2">{{ totalWeight }}<span class="fs-5">KG</span></span>
                <span class="text-muted ms-2">{{ totalPercent }}%</span>
              </div>
              <div class="progress custom-progress mb-1">
                <div class="progress-bar bg-success" role="progressbar" :style="{ width: totalPercent + '%' }"></div>
              </div>
              <div class="d-flex justify-content-between small">
                <span></span>
                <span class="fw-bold">500KG</span>
              </div>
              <div class="mt-2 text-muted small">
                <font-awesome-icon icon="fa-solid fa-trophy" class="me-1 text-warning" />
                Last Week's Top: <span class="fw-bold">{{ topStall }}</span>
              </div>
            </div>
          </div>

          <!-- Card at bottom -->
          <div class="operator-card card col-12 col-md-8 mx-auto mb-0 flex-grow-1">
            <div class="card-body p-3">
              <!-- Sort Buttons -->
              <div class="mb-3 d-flex row justify-content-center sort-btn-group">
                <button class="sort-btn text-truncate" v-for="option in sortOptions" :key="option" :class="[ sortBy === option ? 'active' : '', 'col-3' ]" @click="sortBy = option">
                  {{ option }}
                </button>
              </div>

              <!-- Leaderboard -->
              <div>
                <div class="fw-bold mb-2">Week 5 Leaderboard</div>

                <!-- Loading state -->
                <div v-if="loading" class="text-center py-4">
                  <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2 text-muted small">Loading leaderboard...</p>
                </div>

                <!-- Error state -->
                <div v-else-if="error" class="text-center py-4">
                  <div class="text-danger mb-2">
                    <font-awesome-icon icon="fa-solid fa-exclamation-triangle" />
                  </div>
                  <p class="text-danger small">{{ error }}</p>
                  <button @click="$router.go(0)" class="btn btn-outline-success btn-sm">
                    Retry
                  </button>
                </div>

                <!-- Leaderboard content -->
                <ol v-else class="list-unstyled leaderboard-list">
                  <li v-for="(stall, idx) in sortedStalls" :key="stall.id" class="mb-3 leaderboard-item">
                    <router-link
                      v-if="stall.id"
                      :to="{ name: 'operator-detail', params: { id: stall.id.toString() } }"
                      class="text-decoration-none text-body d-block"
                    >
                      <div class="row align-items-center gx-2">
                      <!-- Stall: icon + name + location -->
                      <div class="col d-flex align-items-center">
                        <div class="leaderboard-icon me-2" :style="{ background: stall.iconBg }">
                          <font-awesome-icon :icon="stall.icon" class="text-white fs-4" />
                        </div>
                        <div>
                          <div class="fw-semibold">{{ stall.name }}</div>
                          <div class="small text-primary">{{ stall.location }}</div>
                        </div>
                      </div>
                      <!-- Grade and Stats: aligned in one flex row -->
                      <div class="col-auto d-flex align-items-center justify-content-end">
                        <div class="grade-badge text-center me-2" :class="'grade-' + stall.grade">{{ stall.grade }}</div>
                        <div class="text-end">
                          <div class="fw-bold">{{ stall.totalWeight.toFixed(1) }} kg</div>
                          <div class="small text-muted">{{ stall.usage }} uses</div>
                        </div>
                      </div>
                    </div>
                    </router-link>
                    <!-- Fallback for stalls without valid IDs -->
                    <div
                      v-else
                      class="text-decoration-none text-body d-block opacity-50"
                    >
                      <div class="row align-items-center gx-2">
                      <!-- Stall: icon + name + location -->
                      <div class="col d-flex align-items-center">
                        <div class="leaderboard-icon me-2" :style="{ background: stall.iconBg }">
                          <font-awesome-icon :icon="stall.icon" class="text-white fs-4" />
                        </div>
                        <div>
                          <div class="fw-semibold">{{ stall.name }}</div>
                          <div class="small text-primary">{{ stall.location }}</div>
                        </div>
                      </div>
                      <!-- Grade and Stats: aligned in one flex row -->
                      <div class="col-auto d-flex align-items-center justify-content-end">
                        <div class="grade-badge text-center me-2" :class="'grade-' + stall.grade">{{ stall.grade }}</div>
                        <div class="text-end">
                          <div class="fw-bold">{{ stall.totalWeight.toFixed(1) }} kg</div>
                          <div class="small text-muted">{{ stall.usage }} uses</div>
                        </div>
                      </div>
                    </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LogoutButton from '../components/LogoutButton.vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { getStallRankings } from '../services/stall.js'
import { useUserStore } from '../stores/user.js'
import { isLoading } from '@/stores/loading'

const router = useRouter()
const userStore = useUserStore()

const stallsData = ref([])
const loading = ref(true)
const error = ref(null)

const sortOptions = ['Daily', 'Weekly', 'Monthly', 'Year']
const sortBy = ref('Weekly')

// Get current date formatted nicely
const currentDate = computed(() => {
  const now = new Date()
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  return now.toLocaleDateString('en-GB', options)
})

// Fetch stall rankings from backend
onMounted(async () => {
  isLoading.value++
  loading.value = true
  try {
    const rankings = await getStallRankings()
    // console.log('Raw rankings data:', rankings) // Debug log

    stallsData.value = rankings.map((stall) => ({
      id: stall.id, // Backend now returns proper IDs
      name: stall.name,
      location: stall.shorten_location,
      usage: stall.count, // Number of times digestor was used
      totalWeight: parseFloat(stall.total_weight) || 0, // Total weight in kg
      icon: getStallIcon(stall.name),
      iconBg: getIconBackground(stall.total_weight || 0),
      grade: getGrade(stall.total_weight || 0),
      // Add timestamp for potential future sorting
      lastUpdated: new Date()
    }))

    // console.log('Processed stalls data:', stallsData.value) // Debug log
  } catch (err) {
    error.value = err.message
    // console.error('Error fetching stall rankings:', err)
  } finally {
    isLoading.value--
    loading.value = false
  }
})

// Helper function to assign icons based on stall name
function getStallIcon(stallName) {
  const name = stallName.toLowerCase()
  if (name.includes('taste') || name.includes('nanyang') || name.includes('1983')) {
    return ['fa-solid', 'bowl-rice']
  } else if (name.includes('bræk') || name.includes('vegetarian')) {
    return ['fa-solid', 'leaf']
  } else if (name.includes('cup') || name.includes('bubble') || name.includes('tea')) {
    return ['fa-solid', 'mug-saucer']
  } else if (name.includes('pasta') || name.includes('noodle')) {
    return ['fa-solid', 'bowl-food']
  } else if (name.includes('cai png') || name.includes('rice')) {
    return ['fa-solid', 'bowl-rice']
  } else {
    return ['fa-solid', 'utensils']
  }
}

// Helper function to get icon background based on total weight
function getIconBackground(totalWeight) {
  if (totalWeight >= 5) return '#4db6ff'
  else if (totalWeight >= 2) return '#ffe082'
  else return '#ff8a80'
}

// Helper function to get grade based on total weight
function getGrade(totalWeight) {
  if (totalWeight >= 5) return 'A'
  else if (totalWeight >= 2) return 'B'
  else return 'C'
}

// Implement proper sorting based on sortBy value
const sortedStalls = computed(() => {
  if (loading.value || error.value || !stallsData.value.length) return []

  const stalls = [...stallsData.value]

  // For now, all sort options sort by total weight
  // In the future, you could implement different sorting logic for each period
  switch (sortBy.value) {
    case 'Daily':
      // Could filter data from last 24 hours and sort
      return stalls.sort((a, b) => b.totalWeight - a.totalWeight)
    case 'Weekly':
      // Default backend sorting (already sorted by total weight)
      return stalls.sort((a, b) => b.totalWeight - a.totalWeight)
    case 'Monthly':
      // Could filter data from last 30 days and sort
      return stalls.sort((a, b) => b.totalWeight - a.totalWeight)
    case 'Year':
      // Could filter data from last year and sort
      return stalls.sort((a, b) => b.totalWeight - a.totalWeight)
    default:
      return stalls.sort((a, b) => b.totalWeight - a.totalWeight)
  }
})

const totalWeight = computed(() => {
  if (loading.value || error.value) return 0
  return stallsData.value.reduce((sum, s) => sum + s.totalWeight, 0)
})

const totalPercent = computed(() => {
  const total = totalWeight.value
  return Math.min(100, Math.round((total / 500) * 100)) // 500kg max target
})

const topStall = computed(() => {
  if (loading.value || error.value || stallsData.value.length === 0) return 'No data'
  const sorted = sortedStalls.value
  return sorted[0]?.name || 'No data'
})

function handleLogout() {
  // Use Pinia store to clear user state and redirect
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.operator-container {
  background: linear-gradient(135deg, #00D09E 0%, #00B888 100%);
  min-height: 100vh;
  position: relative;
}
.operator-card {
  background: #f6fff8;
  border-radius: 30px 30px 0 0;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
  border: none;
  /* Removed fixed height to allow card to grow naturally and avoid white gap */
}
/* Add extra padding to the bottom of the card so last item isn't flush with navbar */
.operator-card .card-body {
  padding-bottom: 5rem !important;
}
.custom-progress {
  background: #e0e0e0;
  border-radius: 1rem;
  height: 1.5rem;
  overflow: hidden;
}
.sort-btn-group {
  background: #eafaf1;
  border-radius: 2rem;
  padding: 0.5rem 0.25rem;
}
.sort-btn {
  border: none;
  background: transparent;
  color: #00B888;
  font-weight: 600;
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;
  transition: background 0.2s, color 0.2s;
}
.sort-btn.active, .sort-btn:hover {
  background: #00B888;
  color: #fff;
}
.leaderboard-list {
  margin: 0;
  padding: 0;
}
.leaderboard-item {
  background: #eafaf1;
  border-radius: 1.5rem;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.leaderboard-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.5rem;
}
.grade-badge {
  font-weight: 700;
  font-size: 1.1rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  margin-right: 0;
}
.grade-A {
  background: #00B888;
}
.grade-B {
  background: #ffc107;
  color: #222;
}
.grade-C {
  background: #dc3545;
}
</style>
