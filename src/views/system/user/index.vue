<template>
  <div class="system-user-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <!-- 顶部操作 -->
      <div class="system-user-search mb15 flex-sb-c">
        <el-button
          size="default"
          type="success"
          class="ml10"
          @click="onOpenAddUser('add')"
        >
          <el-icon>
            <ele-FolderAdd />
          </el-icon>
          新增用户
        </el-button>

        <Peng-Search
          placeholder="请输入用户名"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>
      <!-- 用户表格 -->
      <PengTable
        :loading="tableState.loading"
        :data="tableState.data"
        :isFilterShowColumn="true"
        :pagerInfo="tableState.pagerInfo"
        :columns="tableState.tableColumns"
        @pageNumOrSizeChange="handlePageInfoChange"
        @columnSort="handleColumnChange"
      >
        <!-- 用户名 -->
        <template #uName="{ row, prop }">
          <span v-html="queryStrStyle(row[prop])" />
        </template>
        <!-- 状态 -->
        <template #state="{ row, prop }">
          <el-tag
            size="small"
            effect="dark"
            type="success"
            v-if="row[prop] === 1"
          >正常</el-tag>
          <el-tag
            size="small"
            effect="dark"
            type="warning"
            v-else-if="row[prop] === 2"
          >锁定</el-tag>
          <el-tag
            size="small"
            effect="dark"
            type="danger"
            v-else-if="row[prop] === 3"
          >封禁</el-tag>
        </template>

        <!-- 操作 -->
        <template #operation="{ row }">
          <el-button
            circle
            title="修改信息"
            size="small"
            type="primary"
            :icon="Edit"
            :disabled="row.id === 1"
          />
          <el-button
            circle
            title="删除"
            size="small"
            type="danger"
            :icon="Delete"
            :disabled="row.id === 1"
          />
        </template>
      </PengTable>

    </el-card>
    <UserDialog
      ref="userDialogRef"
      @refresh="getTableData()"
    />
  </div>
</template>

<script setup lang="ts" name="systemUser">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'
import { useUserApi } from '@/api/user'

const { getUserList } = useUserApi()

const tableState = reactive({
	loading: false,
	data: [],
	tableColumns: [
		{ label: '用户名', prop: 'userName', minWidth: 130, tooltip: true, fixed: 'left', slotName: 'uName' },
		{ label: '角色', prop: 'roleId' },
		{ label: '用户状态', prop: 'state', slotName: 'state', minWidth: 120, sort: true },
		{ label: '邮箱', prop: 'email', minWidth: 200, tooltip: true },
		{ label: '解禁时间', prop: 'unsealTime', minWidth: 200, sort: true },
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
// 获取用户表格数据
const getUserTableData = async () => {
	try {
		tableState.loading = true
		const params = {
			page: tableState.pagerInfo.page,
			pageSize: tableState.pagerInfo.pageSize,
			queryStr: tableState.queryStr,
			column: tableState.column,
			order: tableState.order,
		}
		const { data: res } = await getUserList(params)
		const { code, message, data, total } = res
		if (code !== 200 || message !== 'Success') return
		tableState.data = data
		tableState.pagerInfo.total = total
	} catch (e) {
		throw e
	} finally {
		tableState.loading = false
	}
}
// 引入组件
const UserDialog = defineAsyncComponent(() => import('@/views/system/user/dialog.vue'))

// 定义变量内容
const userDialogRef = ref()
const state = reactive<SysUserState>({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNum: 1,
			pageSize: 10,
		},
	},
})

// 初始化表格数据
const getTableData = () => {
	state.tableData.loading = true
	const data = []
	for (let i = 0; i < 2; i++) {
		data.push({
			userName: i === 0 ? 'admin' : 'test',
			userNickname: i === 0 ? '我是管理员' : '我是普通用户',
			roleSign: i === 0 ? 'admin' : 'common',
			department: i === 0 ? ['vueNextAdmin', 'IT外包服务'] : ['vueNextAdmin', '资本控股'],
			phone: '12345678910',
			email: 'vueNextAdmin@123.com',
			sex: '女',
			password: '123456',
			overdueTime: new Date(),
			status: true,
			describe: i === 0 ? '不可删除' : '测试用户',
			createTime: new Date().toLocaleString(),
		})
	}
	state.tableData.data = data
	state.tableData.total = state.tableData.data.length
	setTimeout(() => {
		state.tableData.loading = false
	}, 500)
}
// 打开新增用户弹窗
const onOpenAddUser = (type: string) => {
	userDialogRef.value.openDialog(type)
}
// 打开修改用户弹窗
const onOpenEditUser = (type: string, row: RowUserType) => {
	userDialogRef.value.openDialog(type, row)
}
// 删除用户
const onRowDel = (row: RowUserType) => {
	ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.userName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			getTableData()
			ElMessage.success('删除成功')
		})
		.catch(() => {})
}

// 搜索
const handleSearch = () => {
	tableState.pagerInfo.page = 1
	getUserTableData()
}

// 分页器修改时触发
const handlePageInfoChange = (pageInfo: any) => {
	const { page, pageSize } = pageInfo
	tableState.pagerInfo.page = page
	tableState.pagerInfo.pageSize = pageSize
	getUserTableData()
}

const handleColumnChange = ({ column, order }: any) => {
	tableState.column = column
	tableState.order = order
	getUserTableData()
}
// 文字搜索高亮
const queryStrStyle = (str: string) => {
	// const result = str.indexOf(tableState.queryStr)
	// if (result === -1) return str
	// return str.replaceAll(tableState.queryStr, `<font color="red">${tableState.queryStr}</font>`)
	const regex = new RegExp(tableState.queryStr, 'ig')
	return str.replace(regex, `<font color="red">$&</font>`)
}

// 页面加载时
onMounted(() => {
	// getTableData()
	getUserTableData()
})
</script>

<style scoped lang="scss">
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
