<template>
  <div class="article system-user-container layout-padding" style="padding: 10px !important">
    <!-- 顶部过滤 -->
    <el-card shadow="hover">
      <el-skeleton :rows="3" animated v-if="articleListState.filterLoading" />
      <div claas="header-filter-container" v-else>
        <div class="row category-row">
          <span class="row-label">分类：</span>

          <div>
            <el-tag
              v-for="{ label, value } in articleListState.categoryList"
              :key="value"
              :effect="value === articleListState.activeCId ? 'dark' : 'plain'"
              size="small"
              class="ml15 pseudo-link"
              @click="handleFilterByCatagory(value)"
            >
              {{ label }}
            </el-tag>
          </div>
        </div>

        <el-divider style="margin: 15px 0" />

        <div class="row category-row">
          <span class="row-label">标签：</span>

          <div>
            <el-tag
              v-for="{ label, value } in articleListState.tagList"
              :key="value"
              :effect="value === articleListState.tagId ? 'dark' : 'plain'"
              size="small"
              class="ml15 pseudo-link"
              @click="handleFilterByTag(value)"
            >
              {{ label }}
            </el-tag>
          </div>
        </div>

        <el-divider style="margin: 15px 0" />

        <div class="row auther-filter-row">
          <span class="row-label">作者：</span>
          <!-- :multiple-limit="5" -->
          <!-- collapse-tags -->
          <div>
            <el-select-v2
              multiple
              size="small"
              class="ml15"
              style="min-width: 90px"
              filterable
              :options="articleListState.authorOptionList"
              v-model="articleListState.authorIds"
            />
            <el-link type="primary" style="font-size: 10px" class="ml10" @click="articleListState.authorIds = [userStore.userInfos.id]">
              只看我自己
            </el-link>
            <el-link type="info" style="font-size: 10px" class="ml10" @click="articleListState.authorIds = []">重置</el-link>
          </div>
        </div>

        <el-divider style="margin: 15px 0" />

        <div class="row other-row">
          <span class="row-label">其他：</span>
          <div class="flex-sb-c" style="flex: 1">
            <!-- 归档查询 -->
            <div class="flex-c-c">
              <span class="mr5" style="font-size: 10px">归档：</span>
              <el-date-picker
                size="small"
                type="datetimerange"
                range-separator="到"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="max-width;: 200px"
                format="YYYY-MM-DD hh:mm:ss"
                value-format="YYYY-MM-DD hh:mm:ss"
                v-model="articleListState.timeVal"
                @change="handleDateRangeChange"
              />
            </div>

            <!-- 搜索框 -->
            <Peng-Search size="small" placeholder="文章标题/内容简介" v-model="articleListState.queryStr" @search="handleSearch" />
          </div>
        </div>
      </div>
    </el-card>

    <!-- 文章列表容器 -->
    <el-card shadow="hover" class="layout-padding-auto mt15" v-loading="articleListState.loading">
      <div
        v-infinite-scroll="load"
        infinite-scroll-immediate
        :infinite-scroll-disabled="articleListState.articleList.length === articleListState.total"
      >
        <template :key="item.id" v-for="item in articleListState.articleList">
          <div class="article-item">
            <!-- 文章标题 -->
            <h2 class="flex-sb-c mb15">
              <span class="pseudo-link-hover" style="border-bottom: 1px solid rgba(0, 0, 0, 0)">
                {{ item.title }}
              </span>
              <!-- 操作 -->
              <div>
                <el-link
                  v-auth="'VIEW'"
                  type="success"
                  icon="View"
                  title="查看"
                  class="ml10"
                  :underline="false"
                  @click="handlePreViewArticle(item.id)"
                />
                <el-link
                  v-auth="'EDIT'"
                  type="primary"
                  icon="EditPen"
                  title="编辑"
                  class="ml10"
                  :underline="false"
                  v-if="isShowEdit(item.authorId)"
                  @click="handleEditArticle(item.id)"
                />
                <el-link
                  v-auth="'DELETE'"
                  type="danger"
                  icon="Delete"
                  title="删除"
                  class="ml10"
                  :underline="false"
                  v-if="isShowDelete(item.authorId)"
                  @click="handleDelete(item.id, item.title)"
                />
              </div>
            </h2>
            <!-- 标签行 -->
            <div class="mb15 flex-s-c">
              <h4>{{ item.categoryName }}</h4>
            </div>
            <!-- 简介段落 -->
            <p class="mb15">{{ item.brief }}</p>

            <!-- 作者信息 -->
            <div class="flex-sb-c mb15">
              <!-- 作者头像 -->
              <div class="flex-c-c">
                <el-avatar :size="22" :src="item.authorAvatar" />
                <span style="font-size: 12px" class="ml5">
                  {{ item.authorName }}
                </span>
              </div>
              <span style="font-size: 12px; color: gray">
                <span>发布于：</span>
                <span>{{ item.createdTime }}</span>
              </span>
            </div>

            <!-- 文章信息 -->
            <div class="flex-sb-c">
              <!-- 文章统计信息 -->
              <div class="flex-c-c article-statistics">
                <template :key="prop" v-for="({ iconName, prop }, i) in articleStatisticsInfoHashMapping">
                  <span class="flex-c-c">
                    <Peng-Icon :name="iconName" />
                    <span class="ml5">{{ item[prop] }}</span>
                  </span>
                  <el-divider direction="vertical" v-if="i !== articleStatisticsInfoHashMapping.length - 1" />
                </template>
              </div>

              <!-- 标签信息 -->
              <div class="">
                <Peng-Icon size="20" name="icon-biaoqian" />

                <el-tag round class="ml5" size="small" effect="plain" :key="tag.id" v-for="tag in item.tags">
                  <Peng-Icon v-if="tag.tagIcon" :name="tag.tagIcon" />
                  <span class="ml3" style="font-size: 10px">
                    {{ tag.tagName }}
                  </span>
                </el-tag>
              </div>
            </div>
            <el-divider style="margin: 15px 0" />
          </div>
        </template>
      </div>

      <!-- 加载完毕 -->
      <p class="flex-c-c" v-if="!articleListState.loading && articleListState.articleList.length === articleListState.total">加载完毕</p>
      <el-backtop :right="100" :bottom="100" />

      <!-- 预览 -->
      <PreviewArticleDialog ref="previewDialogRef" />
    </el-card>
  </div>
</template>

<script lang="ts" setup name="ArticleList">
import { ref, reactive, onMounted, watch, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { AxiosResponse } from 'axios'
import { useRouter } from 'vue-router'
import { useUserApi } from '@/api/user/index'
import { useArticleApi } from '@/api/article/index'
import { useUserInfo } from '@/stores/userInfo'
import { useArticleInfo } from '@/stores/articleInfo'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const articleInfoStore: any = useArticleInfo()
const articleInfoState = storeToRefs(articleInfoStore)
const userStore = useUserInfo()

const { getAllUserOptions } = useUserApi()
const { getArticleList, delArticleById } = useArticleApi()

// 文章统计信息
const articleStatisticsInfoHashMapping = [
  { iconName: 'icon-like-fill', prop: 'likeCount' },
  { iconName: 'icon-unlike-fill', prop: 'dislikeCount' },
  { iconName: 'icon-view-fill', prop: 'viewCount' },
  { iconName: 'icon-pinglun1', prop: 'commentCount' },
]

// 文章列表参数
const articleListState = reactive({
  loading: true,
  filterLoading: false,
  // 选中分类ID
  activeCId: 0,
  // 分类数据
  categoryList: [{ label: '全部', value: 0 }],
  // 标签数据
  tagList: [{ label: '全部', value: 0 }],

  // 选中作者的id
  authorIds: ref<number[]>([]),
  authorOptionList: ref<OperationItem[]>([]),

  // 归档日期
  timeVal: ['', ''],

  page: 1,
  pageSize: 10,
  queryStr: '',
  column: '',
  order: '',
  tagId: 0,

  // 文章列表数据
  articleList: ref<Article[]>([]),
  total: 0,
})

// 获取文章列表
const getArticleDataList = async () => {
  articleListState.loading = true
  try {
    const { queryStr, activeCId, page, pageSize, tagId, order, column, authorIds, timeVal } = articleListState
    const params = {
      page,
      pageSize,
      queryStr,
      column,
      order,
      cId: activeCId,
      tagId,
      authorIds: JSON.stringify(authorIds),
      startTime: timeVal ? timeVal[0] : '',
      endTime: timeVal ? timeVal[1] : '',
    }
    const { data: res }: AxiosResponse<ArticleData> = await getArticleList(params)
    const { data, message, code, total } = res
    if (code !== 200 || message !== 'Success') return
    articleListState.articleList = [...articleListState.articleList, ...data]
    articleListState.total = total
  } catch (e) {
    console.log(e)
  } finally {
    articleListState.loading = false
  }
}

// 分类筛选
const handleFilterByCatagory = (val: number) => {
  if (articleListState.activeCId === val) return
  articleListState.activeCId = val
  resetFilterGetDataList()
}

// 标签筛选
const handleFilterByTag = (val: number) => {
  if (articleListState.tagId === val) return
  articleListState.tagId = val
  resetFilterGetDataList()
}

// 获取用户列表的option数据
const getUserOptions = async () => {
  try {
    const { data: res }: AxiosResponse<UserOptionData> = await getAllUserOptions()
    const { code, message, data } = res
    if (code !== 200 || message !== 'Success') return
    articleListState.authorOptionList = data
  } catch (e) {
    console.log(e)
  }
}

// 归档日期查询
const handleDateRangeChange = () => {
  resetFilterGetDataList()
}

// 搜索
const handleSearch = () => {
  resetFilterGetDataList()
}

// 带有过滤条件的查询 page 和 list 需要重置
const resetFilterGetDataList = () => {
  articleListState.articleList = []
  articleListState.page = 1
  getArticleDataList()
}

// 作者过滤数据变化
watch(
  () => articleListState.authorIds,
  () => resetFilterGetDataList(),
  { deep: true }
)

// 文章列表触底
const load = () => {
  if (articleListState.articleList.length >= articleListState.total) return
  articleListState.page++
  getArticleDataList()
}

// 处理删除文章
const handleDelete = async (id: number, title: string) => {
  const confirmRes = await ElMessageBox.confirm(`此操作将永久文章：“${title}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch(() => false)
  if (!confirmRes) return
  const delRes = await deleteArticle(id)
  if (delRes) resetFilterGetDataList()
}

// 删除文章
const deleteArticle = async (id: number): Promise<boolean> => {
  try {
    const { data: res }: AxiosResponse<ResResponse> = await delArticleById(id)
    const { code, data, message } = res
    if (code !== 200 || message !== 'Success') {
      ElMessage.error(data)
      return false
    } else {
      ElMessage.success(data)
      return true
    }
  } catch (e) {
    console.log(e)
    return false
  }
}

// 编辑文章
const handleEditArticle = (aid: number) => {
  router.push({
    name: 'WriteArticle',
    params: { aid },
  })
}

// 预览组件
const PreviewArticleDialog = defineAsyncComponent(() => import('./components/PreviewArticle.vue'))

const previewDialogRef = ref<RefType>(null)
// 处理预览操作
const handlePreViewArticle = async (aid: number) => {
  await previewDialogRef.value.getArticleDetailById(aid)
  setTimeout(() => {
    previewDialogRef.value.previewDialogStatus = true
  }, 500)
}

// 根据 登录用户 判断 是否展示编辑按钮
const isShowEdit = (aId: number): boolean => userStore.userInfos.id === aId

const isShowDelete = (aId: number): boolean => userStore.userInfos.id === aId || userStore.userInfos.id === 1
// 根据 登录用户 判断是否展示删除按钮 admin 默认可以删除任何
// const isShowEdit = computed<boolean>(
//   (aId: number) => userStore.userInfos.id === aId
// )

onMounted(async () => {
  articleListState.filterLoading = true
  await Promise.all([articleInfoStore.getAllCategoryList(), articleInfoStore.getAllTagList(), getUserOptions()])
  articleListState.filterLoading = false

  articleListState.categoryList = [...articleListState.categoryList, ...articleInfoState.allCategoryOptions.value]

  articleListState.tagList = [...articleListState.tagList, ...articleInfoState.allTagOptions.value]

  getArticleDataList()
})
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  align-items: center;
  .row-label {
    display: flex;
    min-width: 50px;
  }
}
.article {
  :deep(.el-date-editor) {
    max-width: 200px;
  }
  :deep(.el-card__body) {
    overflow-y: auto;
  }
}
.article-item {
  p {
    max-width: 720px;
    max-height: 100px;
    line-height: 22px;
    font-size: 12px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    overflow-y: auto;
  }
}
.article-statistics {
  color: rgba(0, 0, 0, 0.45);
}
</style>
