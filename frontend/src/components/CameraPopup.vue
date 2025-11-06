<template>
<RouterLink to="camera">
  <div class="icon-card">
    <font-awesome-icon icon="fas fa-camera fa-regular" class="camera"/>
  </div>
</RouterLink>

</template>
<style scoped>
.icon-card{
  background: rgba(255,255,255,0.7);
  border: 1px solid black;
  border-radius: 10%;
  position:fixed;
  right:10px;
  bottom:60px;
  z-index:9999;
}

.icon-card:hover{
  background: rgba(255,255,255,1);
}

.camera{
  font-size: 4rem;
  color:rgba(211,211,211,0.7);
}

</style>
