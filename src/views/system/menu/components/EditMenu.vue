<template>
  <Peng-Drawer
    :title="'修改菜单信息'"
    :direction="deviceClientType === 'pc' ? 'rtl' : 'btt'"
    :size="deviceClientType === 'pc' ? '400px' : '50%'"
    v-model="editDrawerStatus"
  >
    <template #main>
      <Peng-Form
        ref="editFormRef"
        size="default"
        :labelW="100"
        :formData="editFormState.data"
        :formItemList="editFormState.formItemList"
      >
        <template #menuIcon>

        </template>
      </Peng-Form>

      <div class="mt20 flex-e-c">
        <el-button
          size="small"
          @click="editDrawerStatus = false"
        >
          取消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleSaveEdit"
        >
          保存
        </el-button>
      </div>
    </template>
  </Peng-Drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, PropType, watch } from 'vue'
import { useAuthPermissionApi } from '@/api/authPermission/index'
import { ElMessage } from 'element-plus'
const { updateAuthPermInfo } = useAuthPermissionApi()

const deviceClientType = inject('deviceClientType')

const props = defineProps({
	editRow: {
		type: Object as PropType<object>,
		require: true,
	},
})
const emits = defineEmits(['updateList'])

// 抽屉状态
const editDrawerStatus = ref<boolean>(false)

const editFormState = reactive({
	data: {
		id: 0,
		menuName: '哈哈哈哈',
		menuPath: '/哈哈哈',
		menuURI: '哈哈哈',
		menuIcon: '',
		parentId: 0,
		roles: [],
	},
	formItemList: ref<FormItem[]>([
		{
			type: 'input',
			label: '菜单名称',
			prop: 'menuName',
			placeholder: '请输入菜单名称',
			rules: [{ required: true, trigger: 'blur' }],
		},
		{
			type: 'input',
			label: '菜单路径',
			prop: 'menuPath',
			placeholder: '请输入菜单路径 例: /xxx',
			rules: [
				{ required: true, trigger: 'blur' },
				{ min: 2, trigger: 'blur' },
			],
		},
		{
			type: 'input',
			label: '菜单唯一标识',
			prop: 'menuURI',
			placeholder: '请输入菜单唯一标识',
			rules: [
				{ required: true, trigger: 'blur' },
				{ min: 2, trigger: 'blur' },
			],
		},
		{
			type: 'input',
			label: '菜单图标',
			prop: 'menuIcon',
			slotName: 'menuIcon',
		},
		{
			type: 'switch',
			label: '是否是一级菜单',
			prop: 'isParentMenu',
			tValue: true,
			fValue: false,
			tText: '是',
			fText: '否',
			isInline: true,
		},
		{
			// 父级菜单 parentId 传0
			type: 'select',
			label: '角色',
			prop: 'parentId',
			// 使用级联选择器处理选择菜单位置信息
			options: [],
		},
	]),
})

const editFormRef = ref<any>(null)
// 处理保存修改
const handleSaveEdit = async () => {
	const valdateRes = await editFormRef.value
		.getRef()
		.validate()
		.catch(() => false)
	if (!valdateRes) return
	const editRes = await saveEditAuthPermisson()
	if (!editRes) return
	editDrawerStatus.value = false
	emits('updateList')
}

// 保存修改数据
const saveEditAuthPermisson = async (): Promise<boolean> => {
	try {
		const { id } = editFormState.data
		const params = {}
		const { data: res } = await updateAuthPermInfo(id, params)
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

watch(
	() => props.editRow,
	(val) => (editFormState.data = JSON.parse(JSON.stringify(val))),
	{
		deep: true,
	}
)

defineExpose({ editDrawerStatus })
</script>

<style lang='scss' scoped>
</style>