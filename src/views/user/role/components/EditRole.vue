<template>
  <Peng-Drawer
    :title="'修改角色信息'"
    :direction="deviceClientType === 'pc' ? 'rtl' : 'btt'"
    :size="deviceClientType === 'pc' ? '400px' : '50%'"
    v-model="editDrawerStatus"
  >
    <template #main>
      <Peng-Form
        ref="editFormRef"
        size="default"
        labelP="top"
        :labelW="100"
        :formData="editFormState.data"
        :formItemList="editFormState.formItemList"
      />

      <div class="mt20 flex-e-c">
        <el-button size="small" @click="editDrawerStatus = false">
          取消
        </el-button>
        <el-button size="small" type="primary" @click="handleSaveEdit">
          保存
        </el-button>
      </div>
    </template>
  </Peng-Drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, PropType, watch } from 'vue'
import { useRoleApi } from '@/api/role/index'
import { ElMessage } from 'element-plus'
import { useUserAuthList } from '@/stores/userAuthList'
import { storeToRefs } from 'pinia'

const { updateRole } = useRoleApi()

const userAuthListStore = useUserAuthList()
const userAuthList = storeToRefs(userAuthListStore)

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
  data: ref<Role>({
    id: 0,
    roleName: '',
    roleDesc: '',
    menus: [],
    operationPermissions: [],
    updateTime: '',
    createdTime: '',
  }),
  formItemList: ref<FormItem[]>([
    {
      type: 'input',
      label: '角色名称',
      prop: 'roleName',
      placeholder: '请输入角色名称',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      type: 'select',
      multiple: true,
      label: '持有菜单',
      prop: 'menus',
      placeholder: '请选择角色拥有菜单',
      rules: [{ required: true, trigger: 'change' }],
      options: [],
    },
    {
      type: 'select',
      multiple: true,
      label: '持有操作权限',
      prop: 'operationPermissions',
      placeholder: '请选择角色拥有操作权限',
      rules: [{ required: true, trigger: 'change' }],
      options: [],
    },
    {
      type: 'textarea',
      label: '角色描述',
      prop: 'roleDesc',
      placeholder: '请输入角色描述',
      rules: [{ required: true, trigger: 'blur' }],
    },
  ]),
})

const editFormRef = ref<RefType>(null)
// 处理保存修改
const handleSaveEdit = async () => {
  const valdateRes = await editFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!valdateRes) return
  const editRes = await saveEditRole()
  if (!editRes) return
  editDrawerStatus.value = false
  emits('updateList')
}

// 保存修改数据
const saveEditRole = async (): Promise<boolean> => {
  try {
    const {
      id,
      roleName,
      roleDesc,
      menus,
      operationPermissions,
      updateTime,
      createdTime,
    } = editFormState.data
    const params = {
      roleName,
      roleDesc,
      menus,
      operationPermissions,
    }
    const { data: res } = await updateRole(id, params)
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
  { deep: true }
)

watch(
  editDrawerStatus,
  async (val) => {
    // 当打开编辑抽屉时 为选择操作权限标识和菜单的下拉选择赋值数据
    if (val) {
      await userAuthListStore.getAllMenuList()
      await userAuthListStore.getAllAuthPermissionList()
      editFormState.formItemList[1].options = userAuthList.allMenuOptions.value
      editFormState.formItemList[2].options =
        userAuthList.allAuthPermissionOptions.value
    }
  },
  {
    deep: true,
    immediate: true,
  }
)

defineExpose({ editDrawerStatus })
</script>

<style lang="scss" scoped></style>
