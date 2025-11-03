<script setup>
import { ref, onMounted, watch  } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { getChallenges, getPointsByUser, sendChallengeCompletion, getPointByDuration } from '@/services/profile.js'
import LogoutButton from '../components/LogoutButton.vue'
import { addToast } from '@/stores/toast.js'


const loading = ref(true)
const router = useRouter()
const userStore = useUserStore()
const challenges = ref([])
const userData = ref([])
const totalPercent = ref(0)
const points = ref(0)
const duration = ref("week")


onMounted(async () => {
  loading.value = true
  challenges.value = await getChallenges(userStore.currentUser.id)
  userData.value = await getPointsByUser(userStore.currentUser.id)
  points.value = await getPointByDuration(userStore.currentUser.id, duration.value)
  totalPercent.value = userData.value.points / 100
  loading.value = false
})

function handleLogout() {
  // Use Pinia store to clear user state and redirect
  userStore.logout()
  router.push('/login')
}
function getIcon() {
    return ['fa-solid', 'utensils']
}

async function submitChallenge(challenge){
  loading.value = true
  try{
  await sendChallengeCompletion(userStore.currentUser.id, challenge.id, "")
  challenges.value = await getChallenges(userStore.currentUser.id)
  userData.value = await getPointsByUser(userStore.currentUser.id)
  points.value = await getPointByDuration(userStore.currentUser.id, duration.value)
  totalPercent.value = userData.value.points / 100
  }catch{
    addToast('Challenge Submission Failed', 'Error')
  }finally{
  loading.value = false

  }
}

watch(duration, async (newVal) => {
  points.value = await getPointByDuration(userStore.currentUser.id, newVal)
})
</script>

<template>
  <div class="operator-container">
    <div class="container-fluid h-100">
      <div class="row h-100 justify-content-center align-items-stretch">
        <div class="d-flex flex-column flex-grow-1 p-0 min-vh-100">
          <div class="d-flex align-items-center justify-content-between px-3 pt-3 pb-5">
            <div>
              <div class="fw-bold fs-5 mb-1">Dashboard</div>
            </div>
            <LogoutButton @logout="handleLogout" />
          </div>

          <div class="progress-section col-12 col-md-8 mx-auto mb-3">
            <div class="progress-section-inner p-3">
              <div class="d-flex align-items-center mb-2 justify-content-between">
                <span class="fw-semibold">Current Points</span>
                <RouterLink to="/rewards" class="fw-semibold text-decoration-underline text-primary"
                  >Rewards</RouterLink
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
                  <p class="mt-2 text-muted small">Loading challenges...</p>
                </div>
                <ol v-else class="list-unstyled leaderboard-list">
                  <!-- TODO -->
                  <div class="mini-card p-1 m-1 d-flex flex-row align-items-center justify-content-between">
                    <div class="mb-0">{{ points.points }} Total Points Earned</div>
                    <select class="form-select w-auto border-0" v-model="duration">
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>

                  <li
                    v-for="(challenge, i) in challenges"
                    :key="challenge.id"
                    :class="['mb-3 leaderboard-item', !challenge.submitted ? '' : 'disabled-color']"
                  >
                    <div v-if="!challenge.submitted" class="row align-items-center gx-2" @click="submitChallenge(challenge)">
                      <div class="col d-flex align-items-center">
                        <div class="leaderboard-icon me-2 active-color">
                          <font-awesome-icon
                            :icon="getIcon(challenge.title)"
                            class="text-white fs-4"
                          />
                        </div>
                        <div>
                          <div :class="i == 0 ? 'fw-semibold first-item-text' : 'fw-semibold'">
                            {{ challenge.title }}
                          </div>
                          <div class="small text-primary">{{ challenge.description }}</div>
                        </div>
                      </div>
                      <div class="col-auto d-flex align-items-center justify-content-end">
                        <div class="fw-bold">{{ challenge.points }} pts</div>
                      </div>
                    </div>
                    <div v-else class="row align-items-center gx-2 ">
                      <div class="col d-flex align-items-center">
                        <div class="leaderboard-icon me-2 disabled-color">
                          <font-awesome-icon
                            :icon="getIcon(challenge.title)"
                            class="text-white fs-4"
                          />
                        </div>
                        <div>
                          <div :class="i == 0 ? 'fw-semibold first-item-text' : 'fw-semibold'">
                            {{ challenge.title }}
                          </div>
                          <div class="small text-primary">Challenge Completed</div>
                        </div>
                      </div>
                      <div class="col-auto d-flex align-items-center justify-content-end">
                        <div class="fw-bold">{{ challenge.points }} pts</div>
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
.active-color{
  background-color: #4db6ff;
}
.disabled-color{
  background-color: lightgray;
}
.leaderboard-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid white 1px;
  border-radius: 50%;
  font-size: 1.5rem;
}
.operator-container {
  background: linear-gradient(135deg, #00d09e 0%, #00b888 100%);
  min-height: 100vh;
  position: relative;
}
.mini-card {
  background: #f6fff8;
  /* Removed fixed height to allow card to grow naturally and avoid white gap */
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
