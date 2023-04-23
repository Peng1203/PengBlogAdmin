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
        @switchChange="handleSwitchChange"
      >
        <template #menuIcon>
          <IconSelector
            :prepend="preIcon"
            v-model="addMenuState.data.menuIcon"
            @get="(icon) => (addMenuState.data.menuIcon = icon)"
          />
        </template>
      </Peng-Form>
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
import { ref, reactive, watch, PropType, computed, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useMenuApi } from '@/api/menu/index'
import { allAuthRoutes } from '@/router/authRoutes'
import { formatFlatteningRoutes } from '@/router/index'
import { useUserAuthList } from '@/stores/userAuthList'

const userAuthListStore = useUserAuthList()
const userAuthList = storeToRefs(userAuthListStore)

const IconSelector = defineAsyncComponent(() => import('@/components/iconSelector/index.vue'))

const { addMenu } = useMenuApi()

const emits = defineEmits(['updateList'])

const props = defineProps({
  URIs: {
    type: Array as PropType<string[]>,
  },
})

const addMenuDialogStatus = ref<boolean>(false)

const addMenuState = reactive({
  data: {
    menuName: '',
    menuPath: '',
    menuURI: '',
    menuIcon: '',
    parentId: 0,
    roles: ref<number[]>([1]),
    // 不需要提交的属性
    isParentMenu: true,
    updateTime: '',
    createdTime: '',
  },
  formItemList: ref<FormItem[]>([
    {
      xs: 24,
      span: 12,
      type: 'select',
      label: '选择添加菜单',
      prop: 'menuURI',
      options: [],
      rules: [{ required: true, message: '请选择菜单', trigger: 'change' }],
    },
    {
      xs: 24,
      span: 12,
      disabled: true,
      type: 'input',
      label: '菜单名',
      prop: 'menuName',
      placeholder: '',
      rules: [{ required: true, trigger: 'change' }],
    },
    {
      xs: 24,
      span: 12,
      disabled: true,
      type: 'input',
      label: '菜单路径',
      prop: 'menuPath',
      rules: [{ required: true, trigger: 'change' }],
    },
    {
      xs: 24,
      span: 12,
      disabled: true,
      type: 'input',
      label: '唯一URI',
      prop: 'menuURI',
      placeholder: '',
      rules: [{ required: true, trigger: 'change' }],
    },
    {
      xs: 24,
      span: 12,
      type: 'slot',
      label: '菜单图标',
      prop: 'menuIcon',
      slotName: 'menuIcon',
    },
    {
      xs: 24,
      span: 12,
      type: 'select',
      label: '拥有该菜单的角色',
      multiple: true,
      prop: 'roles',
      options: [],
      rules: [{ type: 'array', required: true, trigger: 'change' }],
    },
    {
      xs: 24,
      span: 12,
      type: 'switch',
      label: '是否是父级菜单',
      prop: 'isParentMenu',
      tValue: true,
      fValue: false,
      tText: '是',
      fText: '否',
      isInline: true,
    },
    {
      xs: 24,
      span: 12,
      // 父级菜单 parentId 传0
      type: 'select',
      label: '选择父级菜单',
      prop: 'parentId',
      // 使用级联选择器处理选择菜单位置信息
      options: [],
      isShow: false,
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
    const { menuName, menuPath, menuIcon, menuURI, roles, parentId, updateTime, createdTime } = addMenuState.data
    const params = { menuName, menuPath, menuIcon, menuURI, roles, parentId }
    const { data: res } = await addMenu(params)
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

// 图标选择器前置图标
const preIcon = computed<string>(() => {
  if (addMenuState.data.menuIcon) return addMenuState.data.menuIcon
  else return 'ele-Pointer'
})

// 下拉选择切换
const handleSelectChange = ({ newVal, prop, index }: FormItemChangeType) => {
  // console.log(' -----', { newVal, prop, index })
  // 选择本地菜单切换
  if (prop === 'menuURI' && !index) {
    const selectMenuDetail: any = unAddMenus.value.find((item: any) => item.name === newVal)
    const { name, path, meta } = selectMenuDetail
    addMenuState.data.menuName = meta.title
    addMenuState.data.menuIcon = meta.icon
    addMenuState.data.menuURI = name
    addMenuState.data.menuPath = path
  }
}

// switch 选项切换
const handleSwitchChange = ({ newVal, prop, index }: FormItemChangeType) => {
  if (prop === 'isParentMenu') {
    if (newVal) {
      addMenuState.data.parentId = 0
      addMenuState.formItemList[index + 1].isShow = false
    } else {
      addMenuState.formItemList[index + 1].isShow = true
    }
  }
}

// 可添加菜单详情数组 用于查找
const unAddMenus = ref()
// 下拉筛选数据
const menuOptions = ref([])
watch(
  () => props.URIs,
  (val) => {
    // 根据本地全部的菜单数组 以及数据库中以存在的菜单 对比过滤出 可选添加的新菜单
    const menuRules = formatFlatteningRoutes(allAuthRoutes).filter((rule: any) => !rule.redirect && rule)
    // 过滤出可选菜单
    unAddMenus.value = menuRules.filter((rule: any) => !val?.includes(rule.name))
    menuOptions.value = unAddMenus.value.map((item: any) => ({ label: item.meta.title, value: item.name }))
    addMenuState.formItemList[0].options = menuOptions.value
  },
  {
    deep: true,
    immediate: true,
  }
)

// 弹框关闭时清除表单信息
watch(addMenuDialogStatus, async (val) => {
  if (val) {
    await userAuthListStore.getAllRoleList()
    addMenuState.formItemList[5].options = userAuthList.allRoleOptions.value

  } else {
    addFormRef.value.getRef().resetFields()

    addMenuState.data = {
      menuName: '',
      menuPath: '',
      menuURI: '',
      menuIcon: '',
      parentId: 0,
      roles: [],
      isParentMenu: true,
      updateTime: '',
      createdTime: '',
    }
  }
})

defineExpose({ addMenuDialogStatus })
</script>

<style lang='scss' scoped>
</style>