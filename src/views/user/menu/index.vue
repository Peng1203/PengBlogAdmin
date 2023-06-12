<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <!-- 顶部 -->
      <!-- <IconSelector v-model="test" /> -->
      <div class="mb15 flex-sb-c">
        <div>
          <el-button
            v-auth="'ADD'"
            size="default"
            type="success"
            class="ml10"
            @click="addDialogRef.addMenuDialogStatus = true"
          >
            <!-- @click="addAuthDialogRef.addAuthPermissonDialogStatus = true" -->
            <el-icon>
              <Menu />
            </el-icon>
            添加菜单
          </el-button>

          <AddAllMenuButton />
        </div>

        <Peng-Search
          placeholder="请输入菜单名称"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>

      <Peng-Table
        :isFilterShowColumn="true"
        :data="tableState.data"
        :loading="tableState.loading"
        :pagerInfo="tableState.pagerInfo"
        :columns="tableState.tableColumns"
        @columnSort="handleColumnChange"
        @pageNumOrSizeChange="handlePageInfoChange"
      >
        <!-- expand 展开column 插槽 -->
        <!-- <template #expand>
          <el-table-column width="30" type="expand" fixed="left">
            <template #default="props"> {{ props.row }} </template>
          </el-table-column>
        </template> -->

        <!-- 权限标识名称 权限标识代码 查询高亮 -->
        <template #queryHighNight="{ row, prop }">
          <div class="flex-s-c">
            <Peng-Icon v-if="row.menuIcon" :name="row.menuIcon" />
            <!-- style="margin-left: 10px;" -->
            <span
              class="ml5"
              v-html="queryStrHighlight(row[prop], tableState.queryStr)"
            />
          </div>
        </template>

        <!-- 菜单图标 -->
        <template #menuIcon="{ row, prop }">
          <!-- type="class" -->
          <Peng-Icon v-if="row[prop]" :name="row[prop]" size="30" />
          <span style="color: red" v-else>{{ '未设置图标' }}</span>
          <!-- <i v-if="row[prop].indexOf('iconfont') !== -1"></i> -->
        </template>

        <!-- 操作 -->
        <template #operation="{ row }">
          <!-- :disabled="row.id === 1" -->
          <el-button
            circle
            v-auth="'EDIT'"
            title="修改菜单信息"
            size="small"
            type="primary"
            :icon="Edit"
            @click="handleEditMenu(row)"
          />
          <!-- @click="handleEditAuthPermission(row)" -->
          <el-button
            circle
            v-auth="'DELETE'"
            title="删除"
            size="small"
            type="danger"
            :icon="Delete"
            @click="handleDelMenu(row)"
          />
          <!-- @click="handleDeleteAuthPermission(row)" -->
          <!-- :disabled="row.id === 1" -->
        </template>
      </Peng-Table>
    </el-card>

    <!-- 编辑菜单抽屉 -->
    <EditMenuDrawer
      :editRow="editRow"
      ref="editDrawerRef"
      @updateList="getMenuTableData"
    />

    <!-- 添加菜单对话框 -->
    <AddMenuDialog
      ref="addDialogRef"
      :URIs="tableState.URIs"
      @updateList="getMenuTableData"
    />
  </div>
</template>

<script setup lang="ts" name="systemMenu">
import { defineAsyncComponent, ref, onMounted, reactive } from 'vue'
// import { RouteRecordRaw } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
// import { storeToRefs } from 'pinia'
// import { useRoutesList } from '@/stores/routesList'
// import { setBackEndControlRefreshRoutes } from "@/router/backEnd";
import { Delete, Edit } from '@element-plus/icons-vue'
import { queryStrHighlight } from '@/utils/queryStrHighlight'
import { useMenuApi } from '@/api/menu/index'
import { AxiosResponse } from 'axios'

const { getMenuList, deleteMenu } = useMenuApi()

// 表格参数
const tableState = reactive({
  loading: false,
  data: ref<Menu[]>([]),
  // 已添加菜单的全部URI标识
  URIs: ref<string[]>(),
  tableColumns: ref<ColumnItem[]>([
    {
      label: '菜单名',
      prop: 'menuName',
      minWidth: 150,
      tooltip: true,
      // fixed: 'left',
      slotName: 'queryHighNight',
      classNname: 'expand-row',
    },
    {
      label: '唯一标识',
      prop: 'menuURI',
      minWidth: 150,
      sort: false,
      tooltip: true,
    },
    { label: '菜单访问路径', prop: 'menuPath', minWidth: 170, tooltip: true },
    {
      label: '菜单图标',
      prop: 'menuIcon',
      minWidth: 100,
      tooltip: true,
      slotName: 'menuIcon',
      align: 'center',
    },
    // { label: '持有角色', prop: 'roles', minWidth: 200, tooltip: true },
    { label: '更新时间', prop: 'updateTime', minWidth: 200, sort: true },
    { label: '创建时间', prop: 'createdTime', minWidth: 200, sort: true },
    {
      label: '操作',
      prop: 'operation',
      minWidth: 95,
      slotName: 'operation',
      fixed: 'right',
    },
  ]),
  column: '',
  order: '',
  queryStr: '',

  // 分页器信息
  pagerInfo: ref<PageInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
  }),
})

// 获取菜单表格数据
const getMenuTableData = async () => {
  try {
    tableState.loading = true
    const { pagerInfo, column, order, queryStr } = tableState
    const params = {
      queryStr,
      column,
      order,
      page: pagerInfo.page,
      pageSize: pagerInfo.pageSize,
    }
    const { data: res }: AxiosResponse<MenuData> = await getMenuList(params)
    const { code, message, data, total, URIs } = res
    if (code !== 200 || message !== 'Success') return
    tableState.data = data
    tableState.pagerInfo.total = total
    tableState.URIs = URIs
    console.log(' tableState.data', JSON.parse(JSON.stringify(tableState.data)))
  } catch (e) {
    console.log(e)
  } finally {
    tableState.loading = false
  }
}

// 分页器修改时触发
const handlePageInfoChange = ({ page, pageSize }: PageChangeParams): void => {
  tableState.pagerInfo.page = page
  tableState.pagerInfo.pageSize = pageSize
  getMenuTableData()
}

// 搜索
const handleSearch = (): void => {
  tableState.pagerInfo.page = 1
  getMenuTableData()
}

// 表格排序
const handleColumnChange = ({ column, order }: ColumnChangeParams) => {
  tableState.column = column
  tableState.order = order
  getMenuTableData()
}

// 处理删除菜单
const handleDelMenu = async (row: Menu) => {
  const confirmRes = await ElMessageBox.confirm(
    `此操作将永久删除菜单：“${row.menuName}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).catch(() => false)
  if (!confirmRes) return
  const delRes = await deleteMenuById(row.id)
  if (delRes) getMenuTableData()
}

// 删除菜单
const deleteMenuById = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await deleteMenu(id)
    const { code, data, message } = res
    if (code !== 200 || message !== 'Success') {
      ElMessage.error(data)
      return false
    }
    ElMessage.success(data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// 处理编辑菜单
const editRow = ref()
const EditMenuDrawer = defineAsyncComponent(
  () => import('./components/EditMenu.vue')
)
const editDrawerRef = ref<RefType>(null)
const handleEditMenu = (row: Menu) => {
  editRow.value = JSON.parse(JSON.stringify(row))
  editDrawerRef.value.editDrawerStatus = true
}

// 处理添加菜单
const AddMenuDialog = defineAsyncComponent(
  () => import('./components/AddMenu.vue')
)
const addDialogRef = ref<RefType>(null)

// 添加全部菜单按钮
const AddAllMenuButton = defineAsyncComponent(
  () => import('./components/AddAllMenu.vue')
)

// 页面加载时
onMounted(() => {
  getMenuTableData()
})
</script>

<style lang="scss" scoped>
.system-user-container {
  :deep(.el-card__body) {
    color: #fff;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    .el-table {
      flex: 1;
    }
  }

  :deep(.expand-row > .cell) {
    display: flex;
    align-items: center;
  }
}
</style>
