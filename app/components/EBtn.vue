<template>
  <button 
    :class="[
      'e-btn',
      `e-btn-${color}`,
      'px-6 py-2 rounded-md font-medium transition-all duration-200',
      'hover:scale-105 active:scale-95'
    ]"
  >
    {{ text || '' }}
    <slot v-if="!text" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  color?: 'success' | 'error' | 'warn'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'success'
})
</script>

<style scoped lang="scss">
.e-btn {
  cursor: pointer;
  border: none;
  outline: none;

  &-success {
    background-color: #22c55e;
    color: white;
    
    &:hover {
      background-color: #16a34a;
    }
    
    &:active {
      background-color: #15803d;
    }
  }

  &-error {
    background-color: #ef4444;
    color: white;
    
    &:hover {
      background-color: #dc2626;
    }
    
    &:active {
      background-color: #b91c1c;
    }
  }

  &-warn {
    background-color: #eab308;
    color: white;
    
    &:hover {
      background-color: #ca8a04;
    }
    
    &:active {
      background-color: #a16207;
    }
  }
}
</style>
