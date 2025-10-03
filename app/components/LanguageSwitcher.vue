<template>
  <div class="language-switcher">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white hover:bg-gray-700 transition-colors"
    >
      <span class="text-lg">🌐</span>
      <span>{{ currentLocaleName }}</span>
      <span class="text-xs">{{ isOpen ? '▲' : '▼' }}</span>
    </button>

    <div
      v-if="isOpen"
      class="absolute mt-2 bg-gray-800 border border-gray-600 rounded-md shadow-lg overflow-hidden z-50 min-w-[150px]"
    >
      <button
        v-for="locale in locales"
        :key="locale.code"
        @click="switchLanguage(locale.code)"
        class="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center gap-2"
        :class="{ 'bg-gray-700': locale.code === currentLocale }"
      >
        <span v-if="locale.code === currentLocale" class="text-green-500">✓</span>
        <span v-else class="w-4"></span>
        <span>{{ locale.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp()
const i18n = nuxtApp.$i18n
const { setLocale, locales } = useI18n()

const currentLocale = ref(i18n.locale.value)
const isOpen = ref(false)

const currentLocaleName = computed(() => {
  const current = locales.value.find(l => l.code === currentLocale.value)
  return current?.name || 'Language'
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const switchLanguage = (code: typeof locales.value[number]['code']) => {
  setLocale(code)
  currentLocale.value = code
  isOpen.value = false
}
</script>

<style scoped lang="scss">
.language-switcher {
  position: relative;
  display: inline-block;
}
</style>
