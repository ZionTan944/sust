<template>
  <div class="operator-container">
    <div class="container-fluid h-100">
      <div class="row h-100 justify-content-center align-items-stretch">
        <div class="d-flex flex-column flex-grow-1 justify-content-between p-0 min-vh-100">
          <!-- Header with Logout Button -->
          <div class="d-flex align-items-center justify-content-between px-3 pt-3">
            <div>
              <div class="fw-bold fs-5 mb-1">Food Waste Leaderboard</div>
              <div class="text-muted small">16th September 2025</div>
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
                <span class="fw-bold">1000KG</span>
              </div>
              <div class="mt-2 text-muted small">
                <font-awesome-icon icon="fa-solid fa-trophy" class="me-1 text-warning" />
                Last Week's Top: <span class="fw-bold">{{ topStall }}</span>
              </div>
            </div>
          </div>

              <!-- Card at bottom -->
          <div class="operator-card card col-12 col-md-8 mx-auto mb-0">
            <div class="card-body p-3">
              <!-- Sort Buttons -->
              <div class="mb-3 d-flex gap-2 justify-content-center sort-btn-group">
                <button class="sort-btn" v-for="option in sortOptions" :key="option" :class="{ active: sortBy === option }" @click="sortBy = option">
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
                      <!-- Grade and Weight: aligned in one flex row -->
                      <div class="col-auto d-flex align-items-center justify-content-end">
                        <div class="grade-badge text-center me-2" :class="'grade-' + stall.grade">{{ stall.grade }}</div>
                        <div class="fw-bold">{{ stall.usage }} KG</div>
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
                      <!-- Grade and Weight: aligned in one flex row -->
                      <div class="col-auto d-flex align-items-center justify-content-end">
                        <div class="grade-badge text-center me-2" :class="'grade-' + stall.grade">{{ stall.grade }}</div>
                        <div class="fw-bold">{{ stall.usage }} KG</div>
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

const router = useRouter()

const stallsData = ref([])
const loading = ref(true)
const error = ref(null)

const sortOptions = ['Daily', 'Weekly', 'Monthly', 'Year']
const sortBy = ref('Weekly')

// Fetch stall rankings from backend
onMounted(async () => {
  try {
    const rankings = await getStallRankings()
    console.log('Raw rankings data:', rankings) // Debug log
    
    // Map stall names to IDs based on database data as fallback
    const stallNameToId = {
      '1983 A Taste of Nanyang': 1,
      'BRÆK. – Vegetarian Options': 2,
      'Each-a-Cup': 3
    }
    
    stallsData.value = rankings
      .map((stall) => ({
        id: stall.id || stallNameToId[stall.name] || null, // Use backend ID or fallback to name mapping
        name: stall.name,
        location: stall.shorten_location,
        usage: stall.count,
        icon: getStallIcon(stall.name),
        iconBg: getIconBackground(stall.count),
        grade: getGrade(stall.count)
      }))
      .filter(stall => stall.id != null && stall.id !== undefined) // Filter out stalls without valid IDs
    
    console.log('Processed stalls data:', stallsData.value) // Debug log
  } catch (err) {
    error.value = err.message
    console.error('Error fetching stall rankings:', err)
  } finally {
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

// Helper function to get icon background based on usage
function getIconBackground(usage) {
  if (usage >= 5) return '#4db6ff'
  else if (usage >= 2) return '#ffe082'
  else return '#ff8a80'
}

// Helper function to get grade based on usage
function getGrade(usage) {
  if (usage >= 5) return 'A'
  else if (usage >= 2) return 'B'
  else return 'C'
}

const sortedStalls = computed(() => {
  if (loading.value || error.value) return []
  // Data from backend is already sorted by count (usage) descending
  return stallsData.value
})

const totalWeight = computed(() => {
  if (loading.value || error.value) return 0
  return stallsData.value.reduce((sum, s) => sum + s.usage, 0)
})

const totalPercent = computed(() => {
  const total = totalWeight.value
  return Math.min(100, Math.round((total / 1000) * 100)) // 1000kg max for demo
})

const topStall = computed(() => {
  if (loading.value || error.value || stallsData.value.length === 0) return 'No data'
  return stallsData.value[0]?.name || 'No data'
})

function handleLogout() {
  // Clear user state if any, then redirect
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
