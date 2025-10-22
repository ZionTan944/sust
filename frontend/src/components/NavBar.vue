<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar fixed-bottom row d-flex p-0 ">
    <div class="col-3"></div>

    <RouterLink class="nav-item col-2 d-flex justify-content-center" to="/operator">
      <div class="nav-box p-2 m-1">
        <font-awesome-icon icon="fa-solid fa-utensils" />
      </div>
    </RouterLink>
    <RouterLink class="nav-item col-2 d-flex justify-content-center" to="/leaderboard">
      <div class="nav-box p-2 m-1">
        <font-awesome-icon icon="fa-solid fa-people-group" />
      </div>
    </RouterLink>
    <RouterLink class="nav-item col-2 d-flex justify-content-center" to="/profile">
      <div class="nav-box p-2 m-1">
        <font-awesome-icon icon="fa-solid fa-user" />
      </div>
    </RouterLink>
    <div class="col-3"></div>
  </nav>
</template>
<style scoped>
nav {
  background-color: #dff7e2;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
}
.nav-box:hover {
  background-color: #00D09E;
  border-radius: 25%;
}
.nav-item {
  color: black;
}
.navbar-brand {
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
