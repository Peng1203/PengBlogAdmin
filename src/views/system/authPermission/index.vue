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
          <!-- @click="()=> addDialogRef.addUserDialogStatus = true" -->
          <!-- @click="handleShowAddDialog" -->
          <i class="iconfont icon-permissions-o" />
          添加权限标识
        </el-button>

        <Peng-Search
          placeholder="请输入权限标识名称"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>

      <Peng-Table>

      </Peng-Table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'

// 表格参数
const tableState = reactive({
	loading: false,
	queryStr: '',
	data: [],
	tableColumns: ref<ColumnItem[]>([
		{ label: '', prop: '', minWidth: '', tooltip: true },
		{ label: '', prop: '', minWidth: '', tooltip: true },
		{ label: '', prop: '', minWidth: '', tooltip: true },
		{ label: '', prop: '', minWidth: '', tooltip: true },
	]),
})

// 获取权限标识数据
const getAuthPermissionTableData = () => {}

// 搜索
const handleSearch = () => {}

onMounted(() => {
	getAuthPermissionTableData()
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