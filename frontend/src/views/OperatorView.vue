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
                {{ periodTopLabel }}: <span class="fw-bold">{{ topStall }}</span>
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
                <div class="fw-bold mb-2">{{ leaderboardTitle }}</div>

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
import { ref, computed, onMounted, watch } from 'vue'
import LogoutButton from '../components/LogoutButton.vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { getStallRankings } from '../services/stall.js'
import { useUserStore } from '../stores/user.js'
import { isLoading } from '@/stores/loading'

const router = useRouter()
const userStore = useUserStore()

const stallsData = ref([])
const overallStallsData = ref([])
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
    // Fetch overall data for progress bar (once, never changes)
    overallStallsData.value = await getStallRankings('all')
    
    // Fetch filtered data for current period
    await fetchFilteredData()
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value--
    loading.value = false
  }
})

// Fetch filtered data based on selected period
async function fetchFilteredData() {
  try {
    const rangeMap = {
      'Daily': 'daily',
      'Weekly': 'weekly',
      'Monthly': 'monthly',
      'Year': 'yearly'
    }
    
    const range = rangeMap[sortBy.value] || 'weekly'
    const rankings = await getStallRankings(range)

    stallsData.value = rankings.map((stall) => ({
      id: stall.id,
      name: stall.name,
      location: stall.shorten_location,
      usage: stall.count,
      totalWeight: parseFloat(stall.total_weight) || 0,
      icon: getStallIcon(stall.name),
      iconBg: getIconBackground(stall.total_weight || 0),
      grade: getGrade(parseFloat(stall.total_weight) || 0, stall.count, sortBy.value),
      lastUpdated: new Date()
    }))
  } catch (err) {
    error.value = err.message
  }
}

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

// Helper function to get grade based on total weight, usage frequency, and consistency
function getGrade(totalWeight, usage, period) {
  // Base score components (out of 100)
  let score = 0
  
  // 1. Weight component (40 points max)
  const weightThresholds = {
    'Daily': { excellent: 2, good: 1, threshold: 0.5 },
    'Weekly': { excellent: 10, good: 5, threshold: 2 },
    'Monthly': { excellent: 30, good: 15, threshold: 5 },
    'Year': { excellent: 300, good: 150, threshold: 50 }
  }
  
  const thresholds = weightThresholds[period] || weightThresholds['Weekly']
  
  if (totalWeight >= thresholds.excellent) {
    score += 40
  } else if (totalWeight >= thresholds.good) {
    score += 30
  } else if (totalWeight >= thresholds.threshold) {
    score += 20
  } else if (totalWeight > 0) {
    score += 10
  }
  
  // 2. Usage frequency component (30 points max)
  const usageThresholds = {
    'Daily': { excellent: 3, good: 2 },
    'Weekly': { excellent: 15, good: 8 },
    'Monthly': { excellent: 40, good: 20 },
    'Year': { excellent: 400, good: 200 }
  }
  
  const usageT = usageThresholds[period] || usageThresholds['Weekly']
  
  if (usage >= usageT.excellent) {
    score += 30
  } else if (usage >= usageT.good) {
    score += 20
  } else if (usage > 0) {
    score += 10
  }
  
  // 3. Consistency component (30 points max)
  const avgWeightPerUse = usage > 0 ? totalWeight / usage : 0
  
  if (avgWeightPerUse >= 0.8) {
    score += 30
  } else if (avgWeightPerUse >= 0.5) {
    score += 20
  } else if (avgWeightPerUse >= 0.3) {
    score += 10
  } else if (avgWeightPerUse > 0) {
    score += 5
  }
  
  // Convert score to letter grade
  if (score >= 80) return 'A'
  else if (score >= 60) return 'B'
  else if (score >= 40) return 'C'
  else if (score > 0) return 'D'
  else return 'F'
}

// Implement proper sorting based on sortBy value
const sortedStalls = computed(() => {
  if (loading.value || error.value || !stallsData.value.length) return []
  
  // Backend already sorts by total_weight DESC, count DESC
  return [...stallsData.value]
})

const totalWeight = computed(() => {
  // Calculate total from overall stalls data (never filtered)
  if (!overallStallsData.value || overallStallsData.value.length === 0) return 0
  
  return overallStallsData.value.reduce((sum, s) => 
    sum + (parseFloat(s.total_weight) || 0), 0
  )
})

const totalPercent = computed(() => {
  const total = totalWeight.value
  return Math.min(100, Math.round((total / 500) * 100))
})

const topStall = computed(() => {
  if (loading.value || error.value || stallsData.value.length === 0) return 'No data'
  const sorted = sortedStalls.value
  return sorted[0]?.name || 'No data'
})

// Dynamic labels based on selected period
const periodTopLabel = computed(() => {
  const labels = {
    'Daily': "Today's Top",
    'Weekly': "This Week's Top",
    'Monthly': "This Month's Top",
    'Year': "This Year's Top"
  }
  return labels[sortBy.value] || "This Week's Top"
})

const leaderboardTitle = computed(() => {
  const titles = {
    'Daily': 'Daily Leaderboard',
    'Weekly': 'Weekly Leaderboard',
    'Monthly': 'Monthly Leaderboard',
    'Year': 'Yearly Leaderboard'
  }
  return titles[sortBy.value] || 'Weekly Leaderboard'
})

function handleLogout() {
  userStore.logout()
  router.push('/login')
}

// Watch for period changes and refetch filtered data
watch(sortBy, async () => {
  loading.value = true
  try {
    await fetchFilteredData()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
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
  flex-shrink: 0;
}
.leaderboard-item .text-end {
  min-width: 75px;
  flex-shrink: 0;
}
.grade-A {
  background: #00B888;
}
.grade-B {
  background: #ffc107;
  color: #222;
}
.grade-C {
  background: #ff9800;
  color: #fff;
}
.grade-D {
  background: #dc3545;
}
.grade-F {
  background: #6c757d;
}
</style>
