<script setup>
import { RouterView, useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue';
import { onMounted } from 'vue';
import {useUserStore} from "@/stores/user"

const userStore = useUserStore()
const router = useRouter()

onMounted(()=>{
    if (!userStore.isAuthenticated) {
      router.push("/login")
    }
})
</script>

<template>
  <header>
    <NavBar v-if="userStore.isAuthenticated"/>
  </header>

  <RouterView />
</template>

