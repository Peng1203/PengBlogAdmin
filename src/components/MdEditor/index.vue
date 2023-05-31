<template>
  <!-- v-model="props.modelValue" -->
  <MdEditor
    v-model="text"
    :theme="props.theme"
    :language="props.lang"
    :showCodeRowNumber="showCodeRowNumber"
    :tableShape="[10, 6]"
    :autoDetectCode="true"
    :toolbars="toolbarConfigHashMapping[config]"
    @onChange="(val: string) => emit('update:modelValue', val)"
  />
  <!-- :sanitize="sanitize" -->
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import sanitizeHtml from 'sanitize-html'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
// 引入公共库中的预览主题
import '@vavt/md-editor-extension/dist/previewTheme/arknights.css'
// 引入公共库中的语言配置
import ZH_TW from '@vavt/md-editor-extension/dist/locale/zh-TW'
import { allToolbars, commonToolbars } from './config'

const toolbarConfigHashMapping = {
  all: allToolbars,
  common: commonToolbars,
}

type Themes = 'light' | 'dark'
type preThemes =
  | 'default'
  | 'github'
  | 'vuepress'
  | 'mk-cute'
  | 'smart-blue'
  | 'cyanosis'
  | 'arknights'
type codeTheme =
  | 'atom'
  | 'a11y'
  | 'github'
  | 'gradient'
  | 'kimbie'
  | 'paraiso'
  | 'qtcreator'
  | 'stackoverflow'

type toolbarConfigs = 'all' | 'common'

interface PengMarkdownEditorAttibute {
  // toolbar配置
  config?: toolbarConfigs
  // 内容
  modelValue: string
  // 主题
  theme?: Themes | undefined
  // 预览主题
  preTheme?: preThemes | undefined
  // 语言
  lang?: string
  // 代码块主题
  codeTheme?: codeTheme
  // 代码块是否显示行数
  showCodeRowNumber?: boolean
  //
  placeholder?: string
  // 不展示的工具栏
  toolbarsExclude?: []
}

const emit = defineEmits(['update:modelValue'])

const props = withDefaults(defineProps<PengMarkdownEditorAttibute>(), {
  config: 'common',
  theme: 'light',
  preTheme: 'default',
  lang: 'zh-CN',
  codeTheme: 'atom',
  showCodeRowNumber: true,
  placeholder: '',
})

// 移除危险内容 xss 相关
const sanitize = (html: string) => sanitizeHtml(html)

// 获取并更新父组件中绑定的值
const hangeUpdateHTML = (html: string) => {
  emit('update:modelValue', html)
}

const text = ref<string>('')

watch(
  () => props.modelValue,
  (val) => (text.value = val),
  {
    deep: true,
    immediate: true,
  }
)
</script>

<style lang="scss" scoped>
.md-editor-footer {
  height: initial;
}
</style>