<script setup>
import { RouterView, useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue';
import { onMounted } from 'vue';
import {useUserStore} from "@/stores/user"
import {isLoading} from "@/stores/loading"
import ToastContainer from './components/ToastContainer.vue';
import SpinLoader from './components/SpinLoader.vue';

const userStore = useUserStore()
const router = useRouter()

onMounted(()=>{
    if (!userStore.isAuthenticated) {
      router.push("/login")
    }
})
</script>

<template>
  <SpinLoader v-if="isLoading > 0"/>
  <ToastContainer/>
  <header>
    <NavBar v-if="userStore.isAuthenticated"/>
  </header>

  <RouterView />
</template>

