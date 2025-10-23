<template>
  <button class="btn btn-link logout-btn" @click="$emit('logout')">Logout
  </button>
</template>

<script setup>
// Emits 'logout' event to parent
</script>

<style scoped>
.logout-btn {
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  color: #dc3545;
  border: none;
  background: rgba(220, 53, 69, 0.08); /* translucent red */
  padding: 0.5rem 1.2rem;
  border-radius: 1.5rem;
  transition: color 0.2s, background 0.2s;
  box-shadow: 0 2px 8px rgba(220,53,69,0.04);
  backdrop-filter: blur(2px);
}
.logout-btn:hover {
  color: #fff;
  background: #dc3545;
  text-decoration: none;
}
</style>
