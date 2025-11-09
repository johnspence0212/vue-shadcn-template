<script setup lang="ts">
// You can add any logic here
</script>

<template>
  <div class="home-view">
    <h1 class="text-3xl font-bold mb-4">Hello World</h1>
    <p class="text-gray-600 mb-4">Welcome to your home page!</p>
    
    <router-link 
      to="/home/details" 
      class="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
    >
      Go to Details Page →
    </router-link>
  </div>
</template>

<style scoped>
.home-view {
  padding: 2rem;
}
</style>
