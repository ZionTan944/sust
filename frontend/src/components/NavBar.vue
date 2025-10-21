<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar fixed-bottom row d-flex">
        <div class="col-3"></div>

        <div class="col-2">
          <RouterLink class="nav-item" to="/d">
            <font-awesome-icon icon="fa-solid fa-utensils" />
          </RouterLink>
        </div>
        <div class="col-2">
          <RouterLink class="nav-item" to="/d">
            <font-awesome-icon icon="fa-solid fa-people-group" />
          </RouterLink>
        </div>
        <div class="col-2">
          <RouterLink class="nav-item" to="/d">
            <font-awesome-icon icon="fa-solid fa-user" />
          </RouterLink>
        </div>
        <div class="col-3"></div>
  </nav>
</template>
<style scoped>
/* Optional: customize the navbar colors */
nav {
  background-color: #dff7e2;
}
.nav-item {
  color: black;
}
.navbar-brand {
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
