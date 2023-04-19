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
        labelP="top"
        :formData="editFormState.data"
        :formItemList="editFormState.formItemList"
        @switchChange="handleSwitchChange"
      >
        <template #menuIcon>
          <!-- style="width: 300px !important;" -->
          <!-- 
            @clear="handleClearIcon" -->
          <!-- disabled -->
          <IconSelector
            :prepend="preIcon"
            v-model="editFormState.data.menuIcon"
            @get="handleGetIcon"
          />
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
import { ref, reactive, inject, PropType, watch, defineAsyncComponent, computed } from 'vue'
import { useMenuApi } from '@/api/menu/index'
import { ElMessage } from 'element-plus'

const IconSelector = defineAsyncComponent(() => import('@/components/iconSelector/index.vue'))
const { updataMenu } = useMenuApi()

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
			type: 'slot',
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
			label: '选择父级菜单',
			prop: 'parentId',
			// 使用级联选择器处理选择菜单位置信息
			options: [],
			isShow: false,
		},
		{
			type: 'select',
			label: '拥有该菜单的角色',
			multiple: true,
			prop: 'roles',
			options: [{ label: 'admin', value: 1 }],
			rules: [{ type: 'array', required: true, trigger: 'change' }],
		},
	]),
})

// 图标选择器前置图标
const preIcon = computed<string>(() => {
	if (editFormState.data.menuIcon) return editFormState.data.menuIcon
	else return 'ele-Pointer'
})

const editFormRef = ref<any>(null)
// 处理保存修改
const handleSaveEdit = async () => {
	const valdateRes = await editFormRef.value
		.getRef()
		.validate()
		.catch(() => false)
	if (!valdateRes) return
	const editRes = await saveEditMenu()
	if (!editRes) return
	editDrawerStatus.value = false
	emits('updateList')
}

// 保存修改数据
const saveEditMenu = async (): Promise<boolean> => {
	try {
		const { id, menuName, menuPath, menuURI, menuIcon, parentId, roles } = editFormState.data
		const params = {
			menuName,
			menuPath,
			menuURI,
			menuIcon,
			parentId,
			roles,
		}
		const { data: res } = await updataMenu(id, params)
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

// switch 组件切换
const handleSwitchChange = ({ newVal, prop, index }: FormItemChangeType) => {
	if (newVal) {
		editFormState.formItemList[5].isShow = false
		editFormState.data.parentId = 0
	} else {
		editFormState.formItemList[5].isShow = true
	}
}

// 获取当前点击的 icon 图标
const handleGetIcon = (icon: string) => (editFormState.data.menuIcon = icon)

watch(
	() => props.editRow,
	(val: any) => {
		editFormState.data = JSON.parse(JSON.stringify(val))
		editFormState.data.isParentMenu = !val.parentId
	},
	{
		deep: true,
	}
)

// 当窗口关闭时 重置表单校验 重置图标
watch(editDrawerStatus, (val) => {
	if (val) return
	console.log('val -----', val)
	editFormRef.value.getRef().resetFields()
	editFormState.data.menuIcon = ''
})

defineExpose({ editDrawerStatus })
</script>

<style lang='scss' scoped>
</style>