<template>
  <Peng-Dialog title="添加菜单" width="45%" v-model="addMenuDialogStatus">
    <template #main>
      <!-- labelP="top" -->
      <Peng-Form
        ref="addFormRef"
        size="default"
        :labelW="'120px'"
        :formData="addMenuState.data"
        :formItemList="addMenuState.formItemList"
        @selectChange="handleSelectChange"
        @switchChange="handleSwitchChange"
        @radioChange="handleRadioChange"
      >
        <!-- 选择父级菜单 -->
        <template #selectParentMenu>
          <el-cascader
            :options="allMenuRules"
            :props="{ checkStrictly: true, value: 'path', label: 'title' }"
            placeholder="请选择上级菜单"
            clearable
            class="w100"
            v-model="addMenuState.data.parentId"
          >
            <template #default="{ node, data }">
              <span>{{ data.title }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </template>

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
      <el-button size="small" @click="addMenuDialogStatus = false"
        >取消</el-button
      >
      <el-button type="primary" size="small" @click="handleAdd">确认</el-button>
    </template>
  </Peng-Dialog>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  watch,
  PropType,
  computed,
  onMounted,
  defineAsyncComponent,
} from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useMenuApi } from '@/api/menu/index'
import { allAuthRoutes } from '@/router/authRoutes'
import { formatFlatteningRoutes } from '@/router/index'
import { useUserAuthList } from '@/stores/userAuthList'
import { useRoutesList } from '/@/stores/routesList'

const userAuthListStore = useUserAuthList()
const userAuthList = storeToRefs(userAuthListStore)
const stores = useRoutesList()

const { routesList } = storeToRefs(stores)

const IconSelector = defineAsyncComponent(
  () => import('@/components/iconSelector/index.vue')
)

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
    menuType: '1',
    updateTime: '',
    createdTime: '',
  },
  formItemList: ref<FormItem[]>([
    {
      xs: 24,
      span: 24,
      type: 'radio',
      label: '菜单类型',
      prop: 'menuType',
      options: ref<RadioItem[]>([
        {
          label: '一级目录',
          value: '1',
        },
        {
          label: '一级菜单',
          value: '3',
        },
        {
          label: '目录',
          value: '2',
        },
        {
          label: '菜单',
          value: '4',
        },
      ]),
    },
    {
      xs: 24,
      span: 24,
      // 父级菜单 parentId 传0
      type: 'slot',
      slotName: 'selectParentMenu',
      label: '父级菜单',
      prop: 'parentId',
      // 使用级联选择器处理选择菜单位置信息
      options: [],
      isShow: false,
    },
    {
      xs: 24,
      span: 12,
      type: 'select',
      label: '添加菜单',
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
      label: '持有角色',
      multiple: true,
      prop: 'roles',
      options: [],
      rules: [{ type: 'array', required: true, trigger: 'change' }],
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
    const {
      menuName,
      menuPath,
      menuIcon,
      menuURI,
      roles,
      parentId,
      updateTime,
      createdTime,
    } = addMenuState.data
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
    const selectMenuDetail: any = unAddMenus.value.find(
      (item: any) => item.name === newVal
    )
    const { name, path, meta } = selectMenuDetail
    addMenuState.data.menuName = meta.title
    addMenuState.data.menuIcon = meta.icon
    addMenuState.data.menuURI = name
    addMenuState.data.menuPath = path
  }
}

// switch 选项切换
const handleSwitchChange = ({ newVal, prop, index }: FormItemChangeType) => {
  // if (prop === 'isParentMenu') {
  //   if (newVal) {
  //     addMenuState.data.parentId = 0
  //     addMenuState.formItemList[index + 1].isShow = false
  //   } else {
  //     addMenuState.formItemList[index + 1].isShow = true
  //   }
  // }
}

// radios 单选框切换
const handleRadioChange = ({ newVal, prop, index }: FormItemChangeType) => {
  if (prop === 'menuType') {
    const findRes = addMenuState.formItemList.find((i) => i.prop === 'parentId')
    if (newVal === '2' || newVal === '4') findRes && (findRes.isShow = true)
    else if (newVal === '1' || newVal === '3')
      findRes && (findRes.isShow = false)
  }
}

// 可添加菜单详情数组 用于查找
const unAddMenus = ref()
// 下拉筛选数据
const menuOptions = ref([])
const allMenuRules = ref<any>()

watch(
  () => props.URIs,
  (val) => {
    // 根据本地全部的菜单数组 以及数据库中以存在的菜单 对比过滤出 可选添加的新菜单
    // .filter((rule: any) => !rule.redirect && rule)
    const menuRules = formatFlatteningRoutes(allAuthRoutes).filter(
      (rule: any) => rule.name !== 'Index'
    )
    // allMenuRules.value = routesList.value.map((menu: any) => {
    //   menu.title = menu.meta.title
    //   return menu
    // })
    // allMenuRules.value = menuRules.map((menu: any) => {
    //   menu.title = menu.meta.title
    //   return menu
    // })
    // 过滤出可选菜单
    unAddMenus.value = menuRules.filter(
      (rule: any) => !val?.includes(rule.name)
    )
    menuOptions.value = unAddMenus.value.map((item: any) => ({
      label: item.meta.title,
      value: item.name,
    }))
    const findMenu = addMenuState.formItemList.find((i) => i.prop === 'menuURI')
    findMenu && (findMenu.options = menuOptions.value)
    // addMenuState.formItemList[0]
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
      roles: [1],
      menuType: '1',
      updateTime: '',
      createdTime: '',
    }
  }
})

// 处理级联选择器菜单数据
const hanldeFormatCascader = (rules: any[]) => {
  rules.forEach((rule) => {
    rule.title = rule.meta.title
    if (rule.children && rule.children.length) {
      hanldeFormatCascader(rule.children)
    }
  })
}

onMounted(() => {
  console.log('routesList.value', JSON.parse(JSON.stringify(routesList.value)))
  hanldeFormatCascader(routesList.value)
  allMenuRules.value = routesList.value
})

defineExpose({ addMenuDialogStatus })
</script>

<style lang="scss" scoped></style>
