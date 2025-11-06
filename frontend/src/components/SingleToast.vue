<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 2000,
  },
  type: {
    type: String,
    default: 'Success',
  },
})

const emit = defineEmits(['close'])

const visible = ref(false)

onMounted(() => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
    emit('close')
  }, props.duration)
})

function closeToast(){
  visible.value = false
  emit('close')
}


</script>

<template>
    <div v-if="visible" :class="type" class="toast toast-pos" >
      <div class="d-flex justify-content-between">
        <h5>{{ type }}</h5>
        <button type="button" class="btn-close"  @click="closeToast"></button>
      </div>
      {{ message }}
    </div>
</template>



<style scoped>
.toast {
  display:block;
  padding: 12px 24px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 9990;
}

.toast.Success {
  background-color: rgba(76, 175, 80, 0.8);
}
.toast.Success:hover {
  background-color: rgba(76, 175, 80, 0.9);
}

.toast.Error {
  background-color: rgba(244, 67, 54, 0.8);
}
.toast.Error:hover {
  background-color: rgba(244, 67, 54, 0.9);
}

.toast.Warning {
  background-color: rgba(255, 152, 0, 0.8);
}.toast.Warning:hover {
  background-color: rgba(255, 152, 0, 0.9);
}

</style>
