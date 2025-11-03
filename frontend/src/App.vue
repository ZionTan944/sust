<script setup>
import { RouterView, useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue';
import { onMounted } from 'vue';
import {useUserStore} from "@/stores/user"
import ToastContainer from './components/ToastContainer.vue';

const userStore = useUserStore()
const router = useRouter()

onMounted(()=>{
    if (!userStore.isAuthenticated) {
      router.push("/login")
    }
})
</script>

<template>
  <ToastContainer/>
  <header>
    <NavBar v-if="userStore.isAuthenticated"/>
  </header>

  <RouterView />
</template>

