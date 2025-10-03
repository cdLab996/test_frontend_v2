<template>
  <NuxtLoadingIndicator color="green" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - My App` : 'My App'
  }
})
</script>
