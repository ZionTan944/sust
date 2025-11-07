<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { claimReward, getAllRewards, getValidRewards } from '@/services/reward.js'
import { getPointsByUser } from '@/services/profile.js'
import { addToast } from '@/stores/toast.js'

import LogoutButton from '../components/LogoutButton.vue'
import { isLoading } from '@/stores/loading.js'

const loading = ref(true)
const router = useRouter()
const userStore = useUserStore()
const rewards = ref([])
const userData = ref([])
const totalPercent = ref(0)
const filter = ref('All')

async function submitReward(rewardId) {
  isLoading.value++
  loading.value = true
  try {
    await claimReward(userStore.currentUser.id, rewardId)
    if (filter.value == 'All') {
      rewards.value = await getAllRewards(userStore.currentUser.id)
      userData.value = await getPointsByUser(userStore.currentUser.id)
      totalPercent.value = userData.value.points / 100
    } else {
      rewards.value = await getValidRewards(userStore.currentUser.id)
      userData.value = await getPointsByUser(userStore.currentUser.id)
      totalPercent.value = userData.value.points / 100
    }

  } catch (error) {
    addToast('Reward Claim Failed', 'Error')

  } finally {
    loading.value = false
    isLoading.value--
  }
}

onMounted(async () => {
  isLoading.value++
  loading.value = true
  try {
    if (filter.value == 'All') {
      rewards.value = await getAllRewards(userStore.currentUser.id)
      userData.value = await getPointsByUser(userStore.currentUser.id)
      totalPercent.value = userData.value.points / 100
    } else {
      rewards.value = await getValidRewards(userStore.currentUser.id)
      userData.value = await getPointsByUser(userStore.currentUser.id)
      totalPercent.value = userData.value.points / 100
    }
  }catch (e){
    addToast('Loading of Page Failed', 'Error')
  }finally{
    loading.value = false
    isLoading.value--

  }
})

function handleLogout() {
  // Use Pinia store to clear user state and redirect
  userStore.logout()
  router.push('/login')
}

watch(filter, async (newVal) => {
  loading.value = true
  isLoading.value++
  try{
    filter.value - newVal
    if (filter.value == 'All') {
      rewards.value = await getAllRewards(userStore.currentUser.id)
    } else {
      rewards.value = await getValidRewards(userStore.currentUser.id)
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
              <div class="fw-bold fs-5 mb-1">Reward Redemption</div>
            </div>
            <LogoutButton @logout="handleLogout" />
          </div>

          <div class="progress-section col-12 col-md-8 mx-auto mb-3">
            <div class="progress-section-inner p-3">
              <div class="d-flex align-items-center mb-2 justify-content-between">
                <span class="fw-semibold">Current Points</span>
                <RouterLink to="/profile" class="fw-semibold text-decoration-underline text-primary"
                  >Challenges</RouterLink
                >
              </div>
              <div class="d-flex align-items-end mb-1">
                <span class="fw-bold display-6 me-2">
                  {{ userData.points }}<span class="fs-5"> Pts</span>
                </span>
              </div>
              <div class="progress custom-progress mb-1">
                <div
                  class="progress-bar bg-success"
                  role="progressbar"
                  :style="{ width: totalPercent + '%' }"
                ></div>
              </div>
              <div class="d-flex justify-content-between small">
                <span></span>
                <span class="fw-bold">10,000 Pts</span>
              </div>
            </div>
          </div>

          <div class="operator-card card col-12 col-md-8 mx-auto mb-0 flex-grow-1 container mt-4">
            <div class="card-body p-3">
              <div>
                <!-- Loading state -->
                <div v-if="loading" class="text-center py-4">
                  <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2 text-muted small">Loading rewards...</p>
                </div>
                <ol v-else class="list-unstyled leaderboard-list">
                  <h2 class="text-center">
                    <select
                      class="header-select d-inline w-50 text-center border-0 bg-main"
                      v-model="filter"
                    >
                      <option value="All">All Rewards</option>
                      <option value="Valid">Valid Rewards</option>
                    </select>
                  </h2>
                  <li
                    v-for="reward in rewards"
                    :key="reward.id"
                    :class="[
                      'mb-3 leaderboard-item',
                      reward.claimed ? '' : '',
                      reward.valid ? '' : 'disabled-color',
                    ]"
                    @click="reward.valid && !reward.claimed ? submitReward(reward.id) : () => {}"
                  >
                    <div class="row align-items-center gx-2">
                      <div class="col d-flex align-items-center">
                        <div>
                          <div class="fw-semibold">
                            {{ reward.reward }}
                          </div>
                          <div v-if="reward.valid && !reward.claimed" class="small text-primary">
                            {{ new Date(reward.valid_until).toLocaleString() }}
                          </div>
                          <div v-else-if="reward.claimed" class="small text-success">Claimed</div>
                          <div v-else class="small text-danger">Expired</div>
                        </div>
                      </div>
                      <div class="col-auto d-flex align-items-center justify-content-end">
                        <div class="fw-bold">{{ reward.cost }} pts</div>
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
.bg-main {
  background: #f6fff8;
}
.disabled-color {
  background-color: lightgray;
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
  border-radius: 1.5rem;
  padding: 0.75rem 1rem;
  border: solid 1px black;
}
</style>
