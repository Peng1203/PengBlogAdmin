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
      multiple
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
          v-show="(isShow === undefined ? true : isShow)"
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
        </el-col>
      </el-form-item>
    </template>
    <!-- <el-form-item label="Activity name">
      <el-col
        :span="12"
        :xs="24"
        :sm="12"
        :md="24"
        :lg="24"
        :xl="24"
      >
        <el-input v-model="form.name" />
      </el-col>
    </el-form-item>
    <el-form-item label="Activity name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="Activity name">
      <el-input v-model="form.name" />
    </el-form-item> -->
  </el-form>

  <!-- <el-form
    :model="form"
    label-width="120px"
    label-suffix=""
  >
    <el-form-item label="Activity name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select
        v-model="form.region"
        placeholder="please select your zone"
      >
        <el-option
          label="Zone one"
          value="shanghai"
        />
        <el-option
          label="Zone two"
          value="beijing"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="Activity time">
      <el-col :span="11">
        <el-date-picker
          v-model="form.date1"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-col>
      <el-col
        :span="2"
        class="text-center"
      >
        <span class="text-gray-500">-</span>
      </el-col>
      <el-col :span="11">
        <el-time-picker
          v-model="form.date2"
          placeholder="Pick a time"
          style="width: 100%"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="Instant delivery">
      <el-switch v-model="form.delivery" />
    </el-form-item>
    <el-form-item label="Activity type">
      <el-checkbox-group v-model="form.type">
        <el-checkbox
          label="Online activities"
          name="type"
        />
        <el-checkbox
          label="Promotion activities"
          name="type"
        />
        <el-checkbox
          label="Offline activities"
          name="type"
        />
        <el-checkbox
          label="Simple brand exposure"
          name="type"
        />
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources">
      <el-radio-group v-model="form.resource">
        <el-radio label="Sponsor" />
        <el-radio label="Venue" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Activity form">
      <el-input
        v-model="form.desc"
        type="textarea"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form> -->
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Edit } from '@element-plus/icons-vue'
const form = reactive({
	name: '',
	region: '',
	date1: '',
	date2: '',
	delivery: false,
	type: [],
	resource: '',
	desc: '',
})

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

// 暴露出 可被父组件调用的变量或方法
defineExpose({ getRef })
</script>

<style lang='scss' scoped>
.el-select {
	width: 100%;
}
</style>