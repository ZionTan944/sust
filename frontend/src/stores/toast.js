import { ref } from 'vue'

export const toasts = ref([])

export function addToast( message, type = 'Success', duration = 2000 ) {
  if(toasts.value.length >= 5){
    toasts.value.splice(0,1)
  }
  const id = Date.now()
  toasts.value.push({ id, message, type, duration })
}

export function removeToast(id) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}
