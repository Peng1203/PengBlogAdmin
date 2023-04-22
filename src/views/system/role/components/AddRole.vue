<template>
  <Peng-Dialog
    title="添加角色"
    width="500px"
    v-model="addRoleDialogStatus"
  >
    <template #main>
      <Peng-Form
        ref="addRoleFormRef"
        size="default"
        labelP="top"
        :labelW="'90px'"
        :formData="addRoleState.data"
        :formItemList="addRoleState.formItemList"
      ></Peng-Form>
    </template>

    <template #footer>
      <el-button
        size="small"
        @click="addRoleDialogStatus = false"
      >取消</el-button>
      <el-button
        type="primary"
        size="small"
        @click="handleAdd"
      >确认</el-button>
    </template>
  </Peng-Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useRoleApi } from '@/api/role/index'
import { useUserAuthList } from '@/stores/userAuthList'

const emits = defineEmits(['updateList'])

const userAuthListStore = useUserAuthList()
const userAuthList = storeToRefs(userAuthListStore)

const { addRole } = useRoleApi()

const addRoleDialogStatus = ref<boolean>(false)

const addRoleState = reactive({
	data: {
		id: 0,
		roleName: '',
		roleDesc: '',
		menus: [],
		operationPermissions: [1],
		updateTime: '',
		createdTime: '',
	},
	formItemList: ref<FormItem[]>([
		{
			xs: 24,
			span: 12,
			type: 'input',
			label: '角色名称',
			prop: 'roleName',
			placeholder: '请输入角色名称',
			rules: [{ required: true, trigger: 'blur' }],
		},
		{
			xs: 24,
			span: 12,
			type: 'select',
			multiple: true,
			label: '持有菜单',
			prop: 'menus',
			placeholder: '请选择角色拥有菜单',
			rules: [{ required: true, trigger: 'change' }],
			options: [],
		},
		{
			xs: 24,
			span: 12,
			type: 'select',
			multiple: true,
			label: '持有操作权限',
			prop: 'operationPermissions',
			placeholder: '请选择角色拥有操作权限',
			rules: [{ required: true, trigger: 'change' }],
			options: [],
		},
		{
			xs: 24,
			span: 12,
			type: 'textarea',
			label: '角色描述',
			prop: 'roleDesc',
			placeholder: '请输入角色描述',
			rules: [{ required: true, trigger: 'blur' }],
		},
	]),
})

const addRoleFormRef = ref<any>(null)
// 处理添加操作
const handleAdd = async () => {
	const validRes = await addRoleFormRef.value
		.getRef()
		.validate()
		.catch(() => false)
	if (!validRes) return
	const addRes = await addNewRole()
	if (!addRes) return
	addRoleDialogStatus.value = false
	emits('updateList')
}

// 添加角色
const addNewRole = async (): Promise<boolean> => {
	try {
		const { roleName, roleDesc, menus, operationPermissions, updateTime, createdTime } = addRoleState.data
		const params = { roleName, roleDesc, menus, operationPermissions }
		const { data: res } = await addRole(params)
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

watch(addRoleDialogStatus, async (val) => {
	if (val) {
		await userAuthListStore.getAllMenuList()
		await userAuthListStore.getAllAuthPermissionList()
		addRoleState.formItemList[1].options = userAuthList.allMenuOptions.value
		addRoleState.formItemList[2].options = userAuthList.allAuthPermissionOptions.value
	} else {
		addRoleFormRef.value.getRef().resetFields()

		addRoleState.data = {
			id: 0,
			roleName: '',
			roleDesc: '',
			menus: [],
			operationPermissions: [],
			updateTime: '',
			createdTime: '',
		}
	}
})

defineExpose({ addRoleDialogStatus })
</script>

<style lang='scss' scoped>
</style>