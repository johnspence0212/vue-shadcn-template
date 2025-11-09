<script setup lang="ts">
// Example child page
</script>

<template>
  <div class="home-details-view">
    <h1 class="text-3xl font-bold mb-4">Home Details</h1>
    <p class="text-gray-600">This is a nested page under Home.</p>
    <router-link to="/" class="text-blue-600 hover:underline mt-4 inline-block">
      ← Back to Home
    </router-link>
  </div>
</template>

<style scoped>
.home-details-view {
  padding: 2rem;
}
</style>
