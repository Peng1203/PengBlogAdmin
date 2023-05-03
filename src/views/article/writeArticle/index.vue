<template>
  <div
    class="article system-user-container layout-padding"
    style="padding: 10px !important"
  >
    <el-card
      shadow="hover"
      style="overflow-y: scroll"
      class="layout-padding-auto"
    >
      <!-- labelP="top" -->
      <Peng-Form
        ref="addFormRef"
        size="default"
        :labelW="'90px'"
        :formData="articleForm"
        :formItemList="articleFormItemList"
      >
        <!-- 封面上传 -->
        <template #cover>
          <el-upload
            class="cover-uploader"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload"
            :http-request="handleUploadCover"
            style="width: 178px; height: 178px"
          >
            <img
              v-if="articleForm.cover"
              :src="articleForm.cover"
              class="cover"
              style="width: 100%; height: 100%"
            />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </template>

        <!-- 文章富文本 -->
        <template #content>
          <Toolbar
            :mode="mode"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            style="border-bottom: 1px solid #ccc"
          />
          <Editor
            :mode="mode"
            :defaultConfig="editorConfig"
            v-model="articleForm.content"
            style="
              width: 100%;
              min-height: 300px;
              max-height: 600px;
              overflow-y: auto;
            "
            @onCreated="handleCreated"
          />
        </template>

        <!-- 实时预览 -->
        <template #preview>
          <div
            style="
              width: 100%;
              word-break: break-all;
              min-height: 300px;
              max-height: 600px;
              overflow-y: auto;
            "
            v-html="articleForm.content"
            id="editor-content-view"
            class="editor-content-view"
          />
        </template>

        <!-- 操作行 -->
        <template #operation>
          <div class="flex-e-c" style="width: 100%">
            <el-button v-if="!isAdd" @click="router.go(-1)">返 回</el-button>
            <el-button type="primary" v-if="isAdd" @click="handleAdd">
              发 布
            </el-button>
            <el-button
              v-else
              type="primary"
              v-if="!isAdd"
              @click="handleSaveEdit"
            >
              保 存
            </el-button>
          </div>
        </template>
      </Peng-Form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watchEffect, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleApi } from '@/api/article/index'

import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { toolbarConfig, editorConfig } from './editorConfig'

const route = useRoute()
const router = useRouter()
const { getArticleDetailById, addArticle, updateArticle, uploadArticleCover } =
  useArticleApi()

const mode = 'simple'

// 是否是添加文章
const isAdd = ref<boolean>(true)

// 文章表单信息
let articleForm = ref<any>({
  title: '',
  brief: '',
  content: '',
  authorId: 0,
  cover: '',
  categoryId: 0,
  tags: ref<number[]>([]),
  // commentCount: 0,
  // likeCount: 0,
  // dislikeCount: 0,
  // viewCount: 0,
  // state: 0,
  // createdTime: '',
  // updateTime: '',
})

// 表单行信息
const articleFormItemList: any[] = reactive([
  {
    xs: 24,
    span: 7,
    type: 'input',
    label: '标题',
    prop: 'title',
    placeholder: '',
    rules: [{ required: true, trigger: 'blur' }],
  },
  {
    xs: 24,
    span: 7,
    type: 'select',
    label: '分类',
    prop: 'categoryId',
    placeholder: '',
    options: [],
    rules: [{ required: true, trigger: 'change' }],
  },
  {
    span: 8,
    type: 'transparent',
  },
  {
    xs: 24,
    span: 14,
    type: 'select',
    multiple: true,
    label: '标签',
    prop: 'tags',
    placeholder: '',
    options: [],
    rules: [{ required: true, trigger: 'change' }],
  },
  {
    xs: 24,
    span: 14,
    type: 'textarea',
    label: '简介',
    prop: 'brief',
    placeholder: '',
  },
  {
    xs: 24,
    span: 14,
    type: 'slot',
    label: '封面',
    slotName: 'cover',
  },
  // 操作行
  {
    xs: 24,
    span: 10,
    type: 'slot',
    slotName: 'operation',
  },
  {
    xs: 24,
    span: 14,
    type: 'slot',
    slotName: 'content',
  },
  {
    xs: 24,
    span: 10,
    type: 'slot',
    slotName: 'preview',
  },
])

// 富文本编辑器
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

// 通过ID获取文章详情
const getArticleDetail = async () => {
  try {
    const { data: res } = await getArticleDetailById(route.params.aid as any)
    const { data, message, code } = res
    if (code !== 200 || message !== 'Success') return
    articleForm.value = data
  } catch (e) {
    console.log(e)
  }
}

// 上传封面
const handleUploadCover = async (fileInfo: any) => {
  try {
    const file = new FormData()
    file.append('file', fileInfo.file)
    const { data: res } = await uploadArticleCover(file)
    articleForm.value.cover = res
  } catch (e) {
    console.log(e)
  }
}

const handleCoverSuccess = () => {
  console.log('上传成功 -----')
}

const beforeCoverUpload = () => {}

// 处理发布文章
const handleAdd = () => {
  console.log(' -----', articleForm.value)
  addNewArticle()
}

// 添加新文章
const addNewArticle = async (): Promise<boolean> => {
  try {
    const params = JSON.parse(JSON.stringify(articleForm.value))
    console.log('params -----', params)
    const { data: res } = await addArticle(params)
    console.log('res -----', res)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// 获取分类下拉列表

// 获取标签下拉列表

// 保存编辑
const handleSaveEdit = () => {
  console.log(' -----', articleForm.value)
}

onMounted(() => {
  if (route.params.aid === ':aid') return
  isAdd.value = false
  getArticleDetail()
})
</script>

<style lang="scss" scoped>
.cover-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.cover-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
