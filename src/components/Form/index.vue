<template>
  <el-form
    ref="formRef"
    :size="size"
    :inline="inline"
    :model="formData"
    :disabled="disabled"
    :label-width="labelW"
    :label-position="labelP"
  >
    <template
      v-for="({
      type,
      label,
      prop, 
      size, 
      rules,
      required,
      disabled,
      placeholder,
      span,
      offset,
      xs,
      sm,
      md,
      lg,
      xl,
      isShow,
      slotName,
      options,
      multiple,
      tValue,
      fValue,
      tText,
      fText,
      tIcon,
      fIcon,
      tBgColor,
      fBgColor,
      isInline
    }, i) in formItemList"
      :key="i"
    >
      <!-- 自定义插槽 -->
      <el-form-item
        v-if="type === 'slot'"
        :prop="prop"
        :label="label"
        v-show="(isShow === undefined ? true : isShow)"
      >
        <slot :name="slotName" />
      </el-form-item>

      <!-- 输入框 -->
      <el-form-item
        v-else-if="type === 'input'"
        :size="size"
        :prop="prop"
        :label="label"
        :rules="rules"
        :required="required"
        v-show="(isShow === undefined ? true : isShow)"
      >
        <el-col
          :span="span || 24"
          :offset="offset || 0"
          :xs="xs || 24"
          :sm="sm || 24"
          :md="md || 24"
          :lg="lg || 24"
          :xl="xl || 24"
        >

          <el-input
            :size="size"
            :placeholder="placeholder"
            :disabled="disabled || false"
            v-model="formData[prop]"
          />
        </el-col>
      </el-form-item>

      <!-- 下拉选择框 -->
      <el-form-item
        v-else-if="type === 'select'"
        :size="size"
        :prop="prop"
        :label="label"
        :rules="rules"
        :required="required"
        v-show="(isShow === undefined ? true : isShow)"
      >
        <el-col
          :span="span || 24"
          :offset="offset || 0"
          :xs="xs || 24"
          :sm="sm || 24"
          :md="md || 24"
          :lg="lg || 24"
          :xl="xl || 24"
        >
          <el-select
            :multiple="multiple"
            :placeholder="placeholder"
            :disabled="disabled || false"
            v-model="formData[prop]"
          >
            <el-option
              v-for="item in options"
              :size="size"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-form-item>

      <!-- switch 选择器 -->
      <el-form-item
        v-else-if="type === 'switch'"
        :size="size"
        :prop="prop"
        :label="label"
        :rules="rules"
        :required="required"
        v-show="(isShow === undefined ? true : isShow)"
      >
        <el-col
          :span="span || 24"
          :offset="offset || 0"
          :xs="xs || 24"
          :sm="sm || 24"
          :md="md || 24"
          :lg="lg || 24"
          :xl="xl || 24"
        >
          <el-switch
            :size="size"
            :placeholder="placeholder"
            :active-text="tText"
            :active-value="tValue"
            :active-icon="tIcon"
            :inactive-text="fText"
            :inactive-value="fValue"
            :inactive-icon="fIcon"
            :inline-prompt="(isInline === undefined ? false : isInline)"
            :style="`--el-switch-on-color: ${tBgColor || '#13ce66'} ; --el-switch-off-color: ${fBgColor || '#ff4949'} `"
            @change="handleSwitchChange($event, prop, i)"
            v-model="formData[prop]"
          />
        </el-col>
      </el-form-item>
    </template>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
interface PengFormAttribute {
	formData: Record<string, unknown>
	formItemList: FormItem[]
	labelW?: string | number
	labelP?: string
	size?: string
	disabled?: boolean
	inline?: boolean
}

const props = withDefaults(defineProps<PengFormAttribute>(), {
	formData: () => ({}),
	formItemList: () => [],
	labelW: 'auto',
	labelP: 'right', // left right top
	size: 'large', // large default small
	disabled: false,
	inline: false,
})

const formRef = ref<any>(null)
// 获取Form表单的Ref
const getRef = () => formRef.value

// switch 切换
const handleSwitchChange = (newVal: any, prop: string, index: number) => {
	console.log('switch切换 -----', newVal, prop, index)
}

// 暴露出 可被父组件调用的变量或方法
defineExpose({ getRef })
</script>

<style lang='scss' scoped>
.el-select {
	width: 100%;
}
</style>