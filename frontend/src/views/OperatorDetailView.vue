<template>
  <div class="operator-container">
    <div class="container-fluid h-100">
      <div class="row justify-content-center h-100">
  <div class="col-12 col-md-8 mx-auto p-0 d-flex flex-column min-vh-100">
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
              <img :src="stall.logo || defaultLogo" alt="logo" class="logo-img" />
            </div>
          </div>

          <!-- Combined Info + Posts card -->
          <div class="operator-card card mx-auto mb-0 flex-grow-1 d-flex flex-column">
            <div class="card-body flex-grow-1 d-flex flex-column" style="overflow-y:auto; padding-bottom: 4rem;">

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
                  <button type="button" class="btn recent-posts-btn">Recent Posts</button>
                </div>

                <!-- Posts grid: real images from API or No posts -->
                <div>
                  <div v-if="imagesLoading" class="text-center py-3">
                    <div class="spinner-border text-success" role="status"><span class="visually-hidden">Loading...</span></div>
                  </div>

                  <div v-else-if="!images.length" class="text-center text-muted small py-4">No posts</div>

                  <div v-else class="gallery-grid">
                    <div class="gallery-item" v-for="(img, idx) in images" :key="idx">
                      <img :src="img" alt="post" class="gallery-img" @click="openModal(img)" style="cursor:pointer;" />
                    </div>
                  </div>

                  <!-- Image modal -->
                  <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
                    <div class="modal-content" @click.stop>
                      <button type="button" class="modal-close" @click="closeModal">✕</button>
                      <img :src="modalSrc" alt="full" class="modal-img" />
                    </div>
                  </div>

                  <!-- Pagination controls - only show when there are images -->
                  <div v-if="images.length > 0" class="mt-3">
                    <nav aria-label="Image pagination">
                      <ul class="pagination justify-content-center mb-0">
                        <li class="page-item" :class="{ disabled: imagesLoading || currentPage <= 1 }">
                          <button type="button" class="page-link" @click="goToPage(currentPage - 1)" :disabled="imagesLoading || currentPage <= 1">Previous</button>
                        </li>

                        <li class="page-item disabled"><span class="page-link">Page {{ currentPage }}</span></li>

                        <li class="page-item" :class="{ disabled: imagesLoading || !hasMore }">
                          <button type="button" class="page-link" @click="goToPage(currentPage + 1)" :disabled="imagesLoading || !hasMore">Next</button>
                        </li>
                      </ul>
                    </nav>
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
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import BackButton from '../components/BackButton.vue'
import { getStallById, getStallImages } from '../services/stall.js'
import { addToast } from '@/stores/toast'
import { isLoading } from '@/stores/loading'

const route = useRoute()
const id = Number(route.params.id)

const stallData = ref(null)
const loading = ref(true)
const error = ref(null)
const images = ref([])
const imagesLoading = ref(false)
const pageSize = ref(12)
const currentPage = ref(1) // 1-based page index
const hasMore = ref(false)

// helper to fetch a page of images and append
async function loadImagesPage(pageNumber) {
  // pageNumber is 1-based
  imagesLoading.value = true
  try {
    const rows = await getStallImages(id, { page: pageNumber, pageSize: pageSize.value })

    let normalized = []
    if (Array.isArray(rows)) normalized = rows
    else if (rows) normalized = [rows]

    const mapped = normalized
      .map(row => {
        // Backend returns { id, image } where image is a Buffer object
        if (!row || !row.image) return null
        
        const imgData = row.image
        
        // Handle Buffer-like object with .data property (mysql2 returns this)
        if (imgData.data && Array.isArray(imgData.data)) {
          try {
            return toB64(imgData.data)
          } catch (e) {
            console.error('Failed to convert buffer to base64:', e)
            return null
          }
        }
        
        // Handle raw Buffer (convert to base64)
        if (imgData.type === 'Buffer' && Array.isArray(imgData.data)) {
          try {
            return toB64(imgData.data)
          } catch (e) {
            return null
          }
        }
        
        // Handle plain string (already base64 or URL)
        if (typeof imgData === 'string') {
          if (imgData.startsWith('data:')) return imgData
          if (!imgData.startsWith('http')) return `data:image/png;base64,${imgData}`
          return imgData
        }
        
        return null
      })
      .filter(Boolean)

    // replace images for the requested page
    images.value = mapped
    
    console.log(`Loaded page ${pageNumber}: ${mapped.length} images (pageSize: ${pageSize.value})`)

    hasMore.value = mapped.length === pageSize.value
    currentPage.value = pageNumber
  } catch (err) {
    console.warn('Failed to load stall images', err)
    hasMore.value = false
  } finally {
    imagesLoading.value = false
  }
}

async function goToPage(pageNumber) {
  if (imagesLoading.value) return
  if (pageNumber < 1) return
  await loadImagesPage(pageNumber)
}

// Fetch stall data from API
onMounted(async () => {
  isLoading.value++
  loading.value = true
  try {
  stallData.value = await getStallById(id)
  // fetch first page of images for this stall
  await loadImagesPage(1)
  } catch (err) {
    error.value = err.message
    addToast("Error fetching stall data. Try again later", "Error")
  } finally {
    isLoading.value--
    loading.value = false
  }
})

function toB64(buffer){
  const base64 = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
  return `data:image/png;base64,${base64}`
}
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
    logo: stallData.value.image ? toB64(stallData.value.image.data) : '',
    locationFull: stallData.value.location || stallData.value.shorten_location || '',
    contact: stallData.value.contact || 'Contact not available',
    hours: stallData.value.opening_hours || 'Hours not available',
    description: stallData.value.description || 'No description available'
  }
})

const defaultLogo = 'https://placehold.co/180x100?text=Logo'

const modalVisible = ref(false)
const modalSrc = ref('')

function openModal(src){
  modalSrc.value = src
  modalVisible.value = true
}

function closeModal(){
  modalVisible.value = false
  modalSrc.value = ''
}

// close modal on Escape key
function onKeydown(e){
  if (e.key === 'Escape' || e.key === 'Esc') {
    if (modalVisible.value) closeModal()
  }
}

watch(modalVisible, (val) => {
  if (val) {
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.operator-container { background: linear-gradient(135deg, #00D09E 0%, #00B888 100%); min-height:100vh; }
.logo-box { width:200px; height:140px; background:#fff; border-radius:26px; padding:0.5px }
.operator-card {
  background: #f6fff8;
  border-radius: 30px 30px 0 0;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
  border: none;
}
.logo-img{
  width: 90%;
  height: 90%;
  object-fit: contain;
}
.recent-posts-btn { background:#eafaf1; color:#000044; border: none; padding: 0.75rem; border-radius: 18px; font-weight:700; }
.post-thumb { background-color:#dfefe6; height:180px; }

/* Gallery grid */
.gallery-grid {
  display: grid;
  gap: 0.5rem;
  /* default: up to 3 columns */
  grid-template-columns: repeat(3, 1fr);
}
.gallery-item { width: 100%; overflow: hidden; border-radius: 12px; background: #f2fff6; }
.gallery-img { width: 100%; height: 200px; object-fit: cover; display:block; }

/* responsive: 2 columns on small tablets, 1 on phones */
@media (max-width: 768px) {
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .gallery-grid { grid-template-columns: repeat(1, 1fr); }
  .gallery-img { height: 240px; }
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  display:flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.65);
  z-index: 1050;
}
.modal-content { position: relative; max-width: 80vw; max-height: 80vh; padding: 0.5rem; border-radius: 10px; background: transparent; display:flex; align-items:center; justify-content:center; }
/* keep image natural aspect ratio: set auto width/height and constrain with max-width/max-height */
.modal-img { display: block; width: auto; height: auto; max-width: 80vw; max-height: 80vh; border-radius: 8px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); }
.modal-close { position: absolute; right: -8px; top: -8px; background: #fff; border: none; border-radius: 50%; width:32px; height:32px; cursor:pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }

/* header adjustments */
.header-row { min-height: 48px; }
.header-row .back-btn { margin-left: 0.25rem; }

/* Detail title styling */
.detail-title {
  color: #072a22; /* dark text */
  text-shadow: 0 1px 0 rgba(255,255,255,0.2);
}
</style>
