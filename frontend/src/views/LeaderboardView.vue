<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { getAllRanking, getRankingByFaculty } from '@/services/student.js'
import LogoutButton from '../components/LogoutButton.vue'
import { isLoading } from '@/stores/loading.js'

const loading = ref(true)
const router = useRouter()
const userStore = useUserStore()

const sortOptions = ['ALL', 'SOE', 'SCIS', 'SOA', 'SOB', 'SOSS', 'SOL']
const sortBy = ref(userStore.currentUser.faculty.toUpperCase())
const topData = ref([])
const rankingData = ref([])

onMounted(async () => {
  isLoading.value++
  loading.value = true
  try{
    topData.value = await getAllRanking()
    if (sortBy.value == 'ALL') {
      rankingData.value = await getAllRanking()
    } else {
      rankingData.value = await getRankingByFaculty(sortBy.value)
    }
  }finally{
  loading.value = false
  isLoading.value--
  }
})

const currentDate = computed(() => {
  const now = new Date()
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  return now.toLocaleDateString('en-GB', options)
})
function handleLogout() {
  // Use Pinia store to clear user state and redirect
  userStore.logout()
  router.push('/login')
}
watch(sortBy, async (newSortBy, oldSortBy) => {
  isLoading.value++
  loading.value=true
  try {
    topData.value = await getAllRanking()
    if (newSortBy == 'ALL') {
      rankingData.value = await getAllRanking()
    } else {
      rankingData.value = await getRankingByFaculty(newSortBy)
    }
  }finally{
    isLoading.value--
    loading.value = false
  }
})
</script>

<template>
  <div class="operator-container">
    <div class="container-fluid h-100">
      <div class="row h-100 justify-content-center align-items-stretch">
        <div class="d-flex flex-column flex-grow-1 p-0 min-vh-100">
          <div class="d-flex align-items-center justify-content-between px-3 pt-3 pb-5">
            <div>
              <div class="fw-bold fs-5 mb-1">Students Leaderboard</div>
              <div class="text-muted small">{{ currentDate }}</div>
            </div>
            <LogoutButton @logout="handleLogout" />
          </div>

          <div class="d-flex flex-row">
            <div v-for="(student, i) in topData.slice(0, 3)" :key="i + 1" :class="['col-4 d-flex flex-column align-items-center',i == 1 ? 'order-first':'']">
              <div :class="['trophy', 'rank-' + (i + 1) + '-t',i == 1 ? 'mt-4':'',i == 2 ? 'mt-5':'']"><font-awesome-icon icon="fa-solid fa-crown fa-5x"/></div>
              <div
                :class="[
                  'card m-1 h-100 w-100',
                  'rank-' + (i + 1),
                  ,i == 1 ? 'mt-3':'',i == 2 ? 'mt-2':''
                ]"
              >
                <div class="player-name fw-bold text-center">{{ student.username }}</div>
              </div>
            </div>
          </div>

          <div class="operator-card card col-12 col-md-8 mx-auto mb-0 flex-grow-1 container mt-4">
            <div class="card-body p-3">
              <!-- Sort Buttons -->
              <div class="mb-3 d-flex justify-content-center sort-btn-group">
                <button
                  class="sort-btn"
                  v-for="option in sortOptions"
                  :key="option"
                  :class="{ active: sortBy === option }"
                  @click="sortBy = option"
                >
                  {{ option }}
                </button>
              </div>

              <div>
                <div class="fw-bold mb-2">
                  {{ sortBy == 'ALL' ? 'Overall' : sortBy }} Leaderboard
                </div>
                <!-- Loading state -->
                <div v-if="loading" class="text-center py-4">
                  <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2 text-muted small">Loading leaderboard...</p>
                </div>
                <!-- Leaderboard content -->
                <ol v-else class="list-unstyled leaderboard-list">
                  <li
                    v-for="(student, i) in rankingData"
                    :key="student.username"
                    :class="i == 0 ? 'mb-3 leaderboard-item first-item' : 'mb-3 leaderboard-item'"
                  >
                    <div class="row align-items-center gx-2">
                      <div class="col d-flex align-items-center">
                        <div>
                          <div :class="i == 0 ? 'fw-semibold first-item-text' : 'fw-semibold'">
                            {{ student.username }}
                          </div>
                          <div class="small text-primary">{{ student.faculty }}</div>
                        </div>
                      </div>
                      <div class="col-auto d-flex align-items-center justify-content-end">
                        <div :class="i == 0 ? 'fw-bold first-item-text' : 'fw-bold'">
                          {{ student.points }} pts
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
<style scoped>

.rank-1-t {
  color: gold;
  font-size: 3rem;
}
.rank-2-t {
  color: silver;
  font-size: 2rem;
}
.rank-3-t {
  color: #cd7f32;
  font-size: 2rem;
}
.rank-1 {
  background-color: gold;
}
.rank-2 {
  background-color: silver;
}
.rank-3 {
  background-color: #cd7f32;
}
.operator-container {
  background: linear-gradient(135deg, #00d09e 0%, #00b888 100%);
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

.sort-btn-group {
  background: #eafaf1;
  border-radius: 2rem;
  padding: 0.5rem 0.25rem;
}
.sort-btn {
  border: none;
  background: transparent;
  color: #00b888;
  font-weight: 600;
  border-radius: 2rem;
  transition:
    background 0.2s,
    color 0.2s;
}
.sort-btn.active,
.sort-btn:hover {
  background: #00b888;
  color: #fff;
}
.leaderboard-list {
  margin: 0;
  padding: 0;
}
.leaderboard-item {
  border: solid black 1px;
  border-radius: 1.5rem;
  padding: 0.75rem 1rem;
}
.first-item {
  border: solid goldenrod 1px;
}
.first-item-text {
  color: goldenrod;
  font-weight: bolder;
}
</style>
