<script setup>
import { sendPhoto } from "@/services/student"
import {ref, onMounted, onUnmounted} from "vue"
import {useRouter} from 'vue-router'
import { useUserStore } from "@/stores/user"
import { addToast } from "@/stores/toast"
import { isLoading } from "@/stores/loading"

const userStore = useUserStore()
const router = useRouter()
const photo = ref("")
const photoBlob = ref(null)

function capturePhoto(){
  const context = canvas.value.getContext('2d')
  canvas.value.width = video.value.videoWidth
  canvas.value.height = video.value.videoHeight
  context.drawImage(video.value, 0, 0)

  canvas.value.toBlob((blob) => {
    photoBlob.value = blob
    photo.value = URL.createObjectURL(blob)
  }, 'image/png')
}

async function submitPhoto(){
  isLoading.value++
  try{
    const res = await sendPhoto(userStore.currentUser.id, photoBlob.value)
    if("challengesCompleted" in res){
      router.push("/profile")
      addToast("Photo successfully submited. Purchase tagged to " + res.stall, "Success")
    }
  }finally{
    isLoading.value--
  }

}

const video = ref(null)
const canvas = ref(null)
let stream = null
onMounted(async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    video.value.srcObject = stream
  } catch (err) {
    alert('Cannot access webcam: ' + err)
  }
})

onUnmounted(() => {
  if (stream) stream.getTracks().forEach((track) => track.stop())
})

</script>
<template>
  <div class="register-face-page">
    <h1>Take Food Photo</h1>

    <div class="camera-container">
      <video ref="video" autoplay playsinline></video>
      <canvas ref="canvas" style="display: none"></canvas>
    </div>

    <div class="d-flex justify-content-start">
      <button @click="capturePhoto" class="capture-button btn btn-primary">
        Capture Photo
      </button>
      <button @click="submitPhoto" class="capture-button btn btn-success" :disabled="!photo">
        Submit
      </button>
    </div>

    <div v-if="photo" class="camera-container">
      <h3>Captured Photo</h3>
        <img :src="photo" alt="Captured photo" />
    </div>
  </div>
</template>
<style scoped>
.camera-container {
  width: 90%;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

video, img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.capture-button{
  display:flex;
  margin: auto;
}
</style>
