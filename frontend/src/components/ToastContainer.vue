<script setup>
import SingleToast from '@/components/SingleToast.vue'
import { toasts, removeToast } from '@/stores/toast'
</script>

<template>
  <div class="toast-container">
    <SingleToast
      v-for="toast in toasts"
      :key="toast.id"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      @close="removeToast(toast.id)"
    />
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  .toast-container {
    position: fixed;
    top: auto;
    left: auto;
    right: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 10;
  }
}
@media (max-width: 767.98px) {
  .toast-container {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
    bottom: auto;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 9999;
  }
}
</style>
