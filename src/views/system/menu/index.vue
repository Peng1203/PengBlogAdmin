<template>
  <div class="system-user-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <!-- 顶部 -->
      <div class="mb15 flex-sb-c">
        <el-button
          size="default"
          type="success"
          class="ml10"
        >
          <!-- @click="addAuthDialogRef.addAuthPermissonDialogStatus = true" -->
          <el-icon>
            <Menu />
          </el-icon>
          添加菜单
        </el-button>

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
        <!-- 权限标识名称 权限标识代码 查询高亮 -->
        <template #queryHighNight="{ row, prop }">
          <span v-html="queryStrHighlight(row[prop], tableState.queryStr)" />
        </template>

        <!-- 操作 -->
        <template #operation="{ row }">
          <!-- :disabled="row.id === 1" -->
          <el-button
            circle
            title="修改菜单信息"
            size="small"
            type="primary"
            :icon="Edit"
          />
          <!-- @click="handleEditAuthPermission(row)" -->
          <el-button
            circle
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
  </div>
</template>

<script setup lang="ts" name="systemMenu">
import { defineAsyncComponent, ref, onMounted, reactive } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRoutesList } from '@/stores/routesList'
// import { setBackEndControlRefreshRoutes } from "@/router/backEnd";
import { Delete, Edit } from '@element-plus/icons-vue'
import { queryStrHighlight } from '@/utils/queryStrHighlight'
import { useMenuApi } from '@/api/menu/index'

const { getMenuList, deleteMenu } = useMenuApi()

// 定义变量内容
const stores = useRoutesList()

// 表格参数
const tableState = reactive({
	loading: false,
	data: [],
	tableColumns: [
		{ label: '菜单名', prop: 'menuName', minWidth: 130, tooltip: true, fixed: 'left', slotName: 'queryHighNight' },
		{ label: '菜单唯一标识', prop: 'menuURI', minWidth: 150, sort: true },
		{ label: '菜单路径', prop: 'menuPath', minWidth: 120 },
		{ label: '菜单图标', prop: 'menuIcon', minWidth: 200, tooltip: true },
		{ label: '持有角色', prop: 'roles', minWidth: 200, tooltip: true },
		{ label: '更新时间', prop: 'updateTime', minWidth: 200, sort: true },
		{ label: '创建时间', prop: 'createdTime', minWidth: 200, sort: true },
		{ label: '操作', minWidth: 95, slotName: 'operation', fixed: 'right' },
	],
	column: '',
	order: '',
	queryStr: '',

	// 分页器信息
	pagerInfo: {
		page: 1,
		pageSize: 10,
		total: 0,
	},
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
		const { data: res } = await getMenuList(params)
		const { code, message, data, total } = res
		if (code !== 200 || message !== 'Success') return
		tableState.data = data
		tableState.pagerInfo.total = total
	} catch (e) {
		console.log(e)
	} finally {
		tableState.loading = false
	}
}

// 分页器修改时触发
const handlePageInfoChange = (pageInfo: any) => {
	const { page, pageSize } = pageInfo
	tableState.pagerInfo.page = page
	tableState.pagerInfo.pageSize = pageSize
	getMenuTableData()
}

// 搜索
const handleSearch = () => {
	tableState.pagerInfo.page = 1
	getMenuTableData()
}

// 表格排序
const handleColumnChange = ({ column, order }: any) => {
	tableState.column = column
	tableState.order = order
	getMenuTableData()
}

// 处理删除菜单
const handleDelMenu = async (row: any) => {
	const confirmRes = await ElMessageBox.confirm(`此操作将永久删除菜单：“${row.menuName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).catch(() => false)
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

// 页面加载时
onMounted(() => {
	getMenuTableData()
})
</script>

<style lang='scss' scoped>
.system-user-container {
	:deep(.el-card__body) {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: auto;
		.el-table {
			flex: 1;
		}
	}
}
</style>
