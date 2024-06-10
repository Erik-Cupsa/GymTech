<template>
  <div class="logo-container">
    <img class="solid-logo animate" src="@/assets/GymLogo.png" alt="Gym Logo" />
  </div>
</template>

<script>
export default {
  name: 'Logo'
}
</script>

<style scoped>
.logo-container {
  width: 70%;
  max-width: 500px;
  opacity: 1;
  position: absolute;
  top: 0;
  right: 15%;
  bottom: 0;
  left: 60%;
  margin: auto;
  animation: fadeIn 2s linear both; 
  animation-delay: 1.4s; 
}

.solid-logo {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 70%;
  max-width: 500px;
  opacity: 0;
  z-index: 1;
}

.logo-container.animate {
  opacity: 1;
}

.solid-logo.animate {
  opacity: 1;
}

@media screen and (max-width: 1150px) {
  .logo-container .solid-logo {
    left: 0;
    top: 200px;
  }
}
</style>
