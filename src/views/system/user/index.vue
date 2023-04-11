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
      </PengTable>

      <el-table
        :data="state.tableData.data"
        v-loading="state.tableData.loading"
        style="width: 100%"
      >
        <!-- label="过滤" -->
        <el-table-column
          width="60"
          align="center"
          fixed="right"
          :filters="[
            { text: '账户名称', value:'userName' },
            { text: '用户昵称', value:'userNickname' },
          ]"
          filter-placement="bottom"
        >
          <template #header>
            <el-icon>
              <Tools />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="60"
        />
        <el-table-column
          prop="userName"
          label="账户名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="userNickname"
          label="用户昵称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="roleSign"
          label="关联角色"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="department"
          label="部门"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="status"
          label="用户状态"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-tag
              type="success"
              v-if="scope.row.status"
            >启用</el-tag>
            <el-tag
              type="info"
              v-else
            >禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="describe"
          label="用户描述"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="操作"
          width="100"
        >
          <template #default="scope">
            <el-button
              :disabled="scope.row.userName === 'admin'"
              size="small"
              text
              type="primary"
              @click="onOpenEditUser('edit', scope.row)"
            >修改</el-button>
            <el-button
              :disabled="scope.row.userName === 'admin'"
              size="small"
              text
              type="primary"
              @click="onRowDel(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
		{ label: '用户名', prop: 'userName', width: 'auto' },
		{ label: '角色', prop: 'roleId', width: 'auto' },
		{ label: '用户状态', prop: 'state', width: 'auto', slotName: 'state' },
		{ label: '邮箱', prop: 'email', width: 'auto' },
		{ label: '解禁时间', prop: 'unsealTime', width: 'auto' },
		{ label: '创建时间', prop: 'updateTime', width: 'auto' },
		{ label: '创建时间', prop: 'createdTime', width: 'auto' },
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
