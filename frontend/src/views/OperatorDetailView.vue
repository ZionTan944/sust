<template>
  <div class="operator-container">
    <div class="container-fluid">
      <div class="row justify-content-center">
  <div class="col-12 col-md-8 mx-auto p-0">
          <!-- Back and title -->
          <div class="position-relative py-3 header-row">
            <div class="position-absolute start-0">
              <BackButton @click="$router.push({ name: 'operator' })" />
            </div>
            <div class="fw-bold fs-5 text-center detail-title">{{ loading ? 'Loading...' : stall.name }}</div>
          </div>

          <!-- Logo rounded box -->
          <div class="d-flex justify-content-center mb-3">
            <div class="logo-box d-flex align-items-center justify-content-center">
              <img :src="stall.logo || defaultLogo" alt="logo" class="img-fluid" />
            </div>
          </div>

          <!-- Combined Info + Posts card -->
          <div class="operator-card card mx-auto" style="margin-bottom:0; min-height:70vh; display:flex; flex-direction:column;">
            <div class="card-body flex-grow-1 d-flex flex-column " style="overflow-y:auto; padding-bottom: 4rem;">
              
              <!-- Loading state -->
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading stall details...</p>
              </div>

              <!-- Error state -->
              <div v-else-if="error" class="text-center py-4">
                <div class="text-danger mb-2">
                  <i class="fas fa-exclamation-triangle fa-2x"></i>
                </div>
                <p class="text-danger">{{ error }}</p>
                <button @click="$router.push({ name: 'operator' })" class="btn btn-outline-success">
                  Back to Leaderboard
                </button>
              </div>

              <!-- Stall content -->
              <div v-else>
                <h6 class="fw-bold small text-uppercase">{{ stall.name }} <span v-if="stall.tagline">- {{ stall.tagline }}</span></h6>
                <p class="small text-muted mt-2">{{ stall.description }}</p>

                <div class="mt-3 small">
                  <div class="fw-semibold">Contact:</div>
                  <div class="text-muted">{{ stall.contact }}</div>
                </div>

                <div class="mt-3 small">
                  <div class="fw-semibold">Opening Hours:</div>
                  <div class="text-muted">{{ stall.hours }}</div>
                </div>

                <div class="mt-3 small">
                  <div class="fw-semibold">Located at</div>
                  <div class="text-muted">{{ stall.locationFull }}</div>
                </div>

                <!-- Recent Posts button -->
                <div class="d-grid my-3">
                  <button class="btn recent-posts-btn">Recent Posts</button>
                </div>

                <!-- Mock posts grid -->
                <div class="row g-2">
                  <div class="col-6" v-for="n in 8" :key="n">
                    <div class="post-thumb bg-light rounded" :style="{ height: '180px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(https://picsum.photos/400/300?random=${n})` }"></div>
                  </div>
                </div>
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
import { useRoute } from 'vue-router'
import BackButton from '../components/BackButton.vue'
import { getStallById } from '../services/stall.js'

const route = useRoute()
const id = Number(route.params.id)

const stallData = ref(null)
const loading = ref(true)
const error = ref(null)

// Fetch stall data from API
onMounted(async () => {
  try {
    stallData.value = await getStallById(id)
  } catch (err) {
    error.value = err.message
    console.error('Error fetching stall data:', err)
  } finally {
    loading.value = false
  }
})

// Transform API data to match component expectations
const stall = computed(() => {
  if (!stallData.value) {
    return {
      name: 'Loading...',
      tagline: '',
      logo: '',
      locationFull: '',
      contact: '',
      hours: '',
      description: ''
    }
  }

  return {
    id: stallData.value.id,
    name: stallData.value.name || 'Unknown Stall',
    tagline: '', // Not in database, could be derived from description
    logo: stallData.value.image || '',
    locationFull: stallData.value.location || stallData.value.shorten_location || '',
    contact: stallData.value.contact || 'Contact not available',
    hours: stallData.value.opening_hours || 'Hours not available',
    description: stallData.value.description || 'No description available'
  }
})

const defaultLogo = 'https://placehold.co/180x100?text=Logo'
</script>

<style scoped>
.operator-container { background: linear-gradient(135deg, #00D09E 0%, #00B888 100%); min-height:100vh; }
.logo-box { width:200px; height:140px; background:#fff; border-radius:26px; }
.operator-card { 
  background: #f6fff8; 
  border-radius: 30px 30px 0 0; 
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1); 
  border: none; 
}
.recent-posts-btn { background:#eafaf1; color:#000044; border: none; padding: 0.75rem; border-radius: 18px; font-weight:700; }
.post-thumb { background-color:#dfefe6; height:180px; }

/* header adjustments */
.header-row { min-height: 48px; }
.header-row .back-btn { margin-left: 0.25rem; }

/* Detail title styling */
.detail-title {
  color: #072a22; /* dark text */
  text-shadow: 0 1px 0 rgba(255,255,255,0.2);
}
</style>
