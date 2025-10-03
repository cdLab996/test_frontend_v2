<template>
  <div class="e-textfield w-full">
    <label 
      v-if="label" 
      :for="computedId"
      class="block mb-2 text-sm font-medium text-gray-200"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input 
      :id="computedId"
      :value="modelValue"
      :disabled="disabled"
      @input="handleInput"
      class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      v-bind="$attrs"
    />
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  id?: string
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const computedId = computed(() => {
  return props.id || `textfield-${Math.random().toString(36).substr(2, 9)}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped lang="scss">
.e-textfield {
  input {
    &:focus {
      box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
    }
  }
}
</style>
