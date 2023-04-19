<template>
  <Peng-Dialog
    title="添加菜单"
    width="40%"
    v-model="addMenuDialogStatus"
  >
    <template #main>
      <Peng-Form
        ref="addFormRef"
        size="default"
        labelP="top"
        :labelW="'90px'"
        :formData="addMenuState.data"
        :formItemList="addMenuState.formItemList"
        @selectChange="handleSelectChange"
      ></Peng-Form>
    </template>

    <template #footer>
      <el-button
        size="small"
        @click="addMenuDialogStatus = false"
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
import { ref, reactive, watch, PropType, computed } from 'vue'
import { useMenuApi } from '@/api/menu/index'
import { ElMessage } from 'element-plus'
import { allAuthRoutes } from '@/router/authRoutes'
import { formatFlatteningRoutes } from '@/router/index'

const { addMenu } = useMenuApi()

const emits = defineEmits(['updateList'])

const props = defineProps({
	URIs: {
		type: Array as PropType<string[]>,
	},
})

// 可添加菜单详情数组
const unAddMenus = ref()

// 根据本地全部的菜单数组 以及数据库中以存在的菜单 过滤出 可选添加的新菜单
const menuOptions = computed(() => {
	// console.log('props -----', props.URIs)
	// console.log('allAuthRoutes -----', allAuthRoutes)
	// 过滤出所以菜单规则 不包括 重定向规则
	const menuRules = formatFlatteningRoutes(allAuthRoutes).filter((rule: any) => !rule.redirect && rule)
	// console.log('menuRules -----', menuRules)
	// 过滤出可选菜单
	unAddMenus.value = menuRules.filter((rule: any) => !props.URIs?.includes(rule.name))
	return unAddMenus.value.map((item: any) => ({ label: item.meta.title, value: item.name }))
})

const addMenuDialogStatus = ref<boolean>(false)

watch(addMenuDialogStatus, (val) => {
	if (!val) {
		addFormRef.value.getRef().resetFields()

		addMenuState.data = {
			menuName: '',
			menuPath: '',
			menuURI: '',
			menuIcon: '',
			parentId: 0,
			roles: [],
			isParentMenu: false,
			updateTime: '',
			createdTime: '',
		}
	}
})

const addMenuState = reactive({
	data: {
		menuName: '',
		menuPath: '',
		menuURI: '',
		menuIcon: '',
		parentId: 0,
		roles: [],
		// 不需要提交的属性
		isParentMenu: false,
		updateTime: '',
		createdTime: '',
	},
	formItemList: ref<FormItem[]>([
		{
			type: 'select',
			label: '选择添加菜单',
			prop: 'menuURI',
			options: menuOptions.value,
		},
		{
			type: 'input',
			label: '标识名称',
			prop: 'permissionName',
			placeholder: '请输入权限标识名称',
			rules: [{ required: true, trigger: 'blur' }],
		},
		{
			type: 'input',
			label: '标识CODE',
			prop: 'permissionCode',
			placeholder: '请输入权限标识',
			rules: [
				{ required: true, trigger: 'blur' },
				{ min: 2, trigger: 'blur' },
			],
		},
		{
			type: 'textarea',
			label: '描述',
			prop: 'desc',
			placeholder: '请输入权限标识描述',
		},
	]),
})

const addFormRef = ref<any>(null)
// 处理添加操作
const handleAdd = async () => {
	const validRes = await addFormRef.value
		.getRef()
		.validate()
		.catch(() => false)
	if (!validRes) return
	const addRes = await addNewMenu()
	if (!addRes) return
	addMenuDialogStatus.value = false
	emits('updateList')
}

// 添加权限标识
const addNewMenu = async (): Promise<boolean> => {
	try {
		const {} = addMenuState.data
		const params = {}
		return false
		// const { data: res } = await addMenu(params)
		// const { code, data, message } = res
		// if (code !== 200 || message !== 'Success') {
		// 	ElMessage.error(data)
		// 	return false
		// } else {
		// 	ElMessage.success(data)
		// 	return true
		// }
	} catch (e) {
		console.log(e)
		return false
	}
}

const handleSelectChange = ({ newVal, prop, index }: FormItemChangeType) => {
	console.log(' -----', { newVal, prop, index })
}

defineExpose({ addMenuDialogStatus })
</script>

<style lang='scss' scoped>
</style>