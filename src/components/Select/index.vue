<template>
  <el-select
    v-model="props.modelValue"
    :style="`width: ${props.width}`"
    :size="props.size"
    :clearable="clearable"
    :filterable="filterable"
    :multiple="props.multiple"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    @change=""
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type SizeEnum = 'large' | 'default' | 'small'

interface SelectAttribute {
  modelValue: any
  width?: string
  options: any[]
  size?: SizeEnum
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  // valueKey?: string
  clearable?: boolean
  filterable?: boolean
}

// 双向数据绑定值
// const value = defineModel()

// const value = ref()

const props = withDefaults(defineProps<SelectAttribute>(), {
  width: '100px',
  placeholder: '',
  size: 'default',
  disabled: false,
  multiple: false,
  filterable: true,
})

const emits = defineEmits([''])
</script>

<style scoped lang="scss"></style>
