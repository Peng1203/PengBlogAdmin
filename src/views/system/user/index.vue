<template>
  <div class="system-user-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <div class="system-user-search mb15">
        <el-input
          size="default"
          placeholder="请输入用户名称"
          style="max-width: 180px"
        > </el-input>
        <el-button
          size="default"
          type="primary"
          class="ml10"
        >
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
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
      </div>
      <!-- 用户表格 -->
      <PengTable
        :data="tableState.data"
        :isFilterShowColumn="true"
        :columns="tableState.tableColumns"
      >
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
          {{'哈哈哈哈'}}
        </template>
      </PengTable>

      <el-pagination
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
        class="mt15"
        :pager-count="5"
        :page-sizes="[10, 20, 30]"
        v-model:current-page="tableState.page"
        background
        v-model:page-size="tableState.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableState.total"
      >
      </el-pagination>
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
import { useUserApi } from '@/api/user'

const { getUserList } = useUserApi()

const tableState = reactive({
	tableColumns: [
		{ label: '用户名', prop: 'userName', minWidth: 100 },
		{ label: '角色', prop: 'roleId' },
		{ label: '用户状态', prop: 'state', slotName: 'state', minWidth: 100 },
		{ label: '邮箱', prop: 'email', minWidth: 200 },
		// {
		// 	label: '其他信息',
		// 	prop: 'authInfo',
		// 	childrenColumns: [
		// 		{ label: '用户名', prop: 'userName', minWidth: 100 },
		// 		{ label: '角色', prop: 'roleId' },
		// 	],
		// },
		{ label: '解禁时间', prop: 'unsealTime', minWidth: 200 },
		{ label: '更新时间', prop: 'updateTime', minWidth: 200 },
		{ label: '创建时间', prop: 'createdTime', minWidth: 200 },
		{ label: '操作', minWidth: 200, slotName: 'operation', fixed: 'right' },
	],
	page: 1,
	pageSize: 10,
	data: [],
	total: 0,
})
// 获取用户表格数据
const getUserTableData = async () => {
	try {
		const params = {
			page: 1,
			pageSize: 10,
			queryStr: '',
			column: '',
			order: 'ASC',
		}
		const { data: res } = await getUserList(params)
		console.log('res -----', res)
		const { code, message, data, total } = res
		if (code !== 200 || message !== 'Success') return
		tableState.data = data
		tableState.total = total
	} catch (e) {
		throw e
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
// 分页改变
const onHandleSizeChange = (val: number) => {
	state.tableData.param.pageSize = val
	getTableData()
}
// 分页改变
const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNum = val
	getTableData()
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
