<template>
    <span>
      <span v-for="(char, i) in strArray" :key="char + i" :class="[letterClass, 'animated-letter']" :style="{ animationDelay: i * 0.1 + 's' }">
        {{ char === ' ' ? '&nbsp;' : char }}
      </span>
    </span>
  </template>
  
  <script>
  export default {
    props: {
      letterClass: String,
      strArray: Array,
    },
  };
  </script>
  
  <style scoped>
  .animated-letter {
    display: inline-block;
    opacity: 0;
    animation: fadeInLetter 5s forwards;
    transition: color 0.3s ease; 
  }
  
  .animated-letter:hover {
    color: #00b3ff;
  }
  
  @keyframes fadeInLetter {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  