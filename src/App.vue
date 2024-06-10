<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app { 
  width: 100%; 
  height: 100%; 
  position: absolute; 
  background: linear-gradient(to bottom right, #000000 30%, #040a1a 80%);
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  overflow: auto;
}

.container { 
  width: 100%; 
  will-change: contents; 
  height: 100%; 
  min-height: 566px; 
  position: absolute; 
  opacity: 0; 
  top: 5%; 
  margin: 0 auto; 
  z-index: 1; 
  transform-style: preserve-3d; 
  animation: fadeIn 1s forwards; 
  animation-delay: 1s; 
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
