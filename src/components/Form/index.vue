<template>
  <!-- :inline="inline" -->
  <el-form
    ref="formRef"
    :size="size"
    :model="formData"
    :disabled="disabled"
    :label-width="labelW"
    :label-position="labelP"
  >
    <el-row :gutter="30">
      <!--  -->

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
      isInline,
      clearable
    }, i) in formItemList"
        :key="i"
      >
        <el-col
          :span="span"
          :offset="offset"
          :xs="xs"
          :sm="sm"
          :md="md"
          :lg="lg"
          :xl="xl"
          :class="i +1 ===  formItemList.length ?'' : 'mb20'"
          v-if="type === 'slot'"
        >
          <!-- 自定义插槽 -->
          <el-form-item
            :prop="prop"
            :label="label"
            v-show="(isShow === undefined ? true : isShow)"
          >
            <slot :name="slotName" />
          </el-form-item>
        </el-col>

        <!-- 输入框 -->
        <el-col
          :span="span"
          :offset="offset"
          :xs="xs"
          :sm="sm"
          :md="md"
          :lg="lg"
          :xl="xl"
          :class="i +1 ===  formItemList.length ?'' : 'mb20'"
          v-else-if="type === 'input'"
        >
          <el-form-item
            :size="size"
            :prop="prop"
            :label="label"
            :rules="rules"
            :required="required"
            v-show="(isShow === undefined ? true : isShow)"
          >
            <el-input
              :size="size"
              :placeholder="placeholder"
              :disabled="disabled || false"
              :clearable="clearable || true"
              v-model="formData[prop]"
            />
          </el-form-item>
        </el-col>

        <!-- 密码框框 -->
        <el-col
          :span="span"
          :offset="offset"
          :xs="xs"
          :sm="sm"
          :md="md"
          :lg="lg"
          :xl="xl"
          :class="i +1 ===  formItemList.length ? '' : 'mb20'"
          v-else-if="type === 'pwd'"
        >
          <el-form-item
            :size="size"
            :prop="prop"
            :label="label"
            :rules="rules"
            :required="required"
            v-show="(isShow === undefined ? true : isShow)"
          >
            <el-input
              type="password"
              show-password
              :size="size"
              :placeholder="placeholder"
              :disabled="disabled || false"
              :clearable="clearable || true"
              v-model="formData[prop]"
            />
          </el-form-item>
        </el-col>

        <!-- 下拉选择框 -->
        <el-col
          :span="span"
          :offset="offset"
          :xs="xs"
          :sm="sm"
          :md="md"
          :lg="lg"
          :xl="xl"
          :class="i +1 ===  formItemList.length ? '' : 'mb20'"
          v-else-if="type === 'select'"
        >
          <el-form-item
            :size="size"
            :prop="prop"
            :label="label"
            :rules="rules"
            :required="required"
            v-show="(isShow === undefined ? true : isShow)"
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
          </el-form-item>
        </el-col>

        <!-- switch 选择器 -->
        <el-col
          :span="span"
          :offset="offset"
          :xs="xs"
          :sm="sm"
          :md="md"
          :lg="lg"
          :xl="xl"
          :class="i + 1 ===  formItemList.length ? '' : 'mb20'"
          v-else-if="type === 'switch'"
        >
          <el-form-item
            :size="size"
            :prop="prop"
            :label="label"
            :rules="rules"
            :required="required"
            v-show="(isShow === undefined ? true : isShow)"
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
          </el-form-item>
        </el-col>
      </template>
    </el-row>
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