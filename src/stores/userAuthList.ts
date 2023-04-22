import { defineStore } from 'pinia'
import { useRoleApi } from '@/api/role/index'
import { useMenuApi } from '@/api/menu/index'
import { useAuthPermissionApi } from '@/api/authPermission/index'

const { getRoleList } = useRoleApi()

const { getMenuList } = useMenuApi()

const { getAuthPermissionList } = useAuthPermissionApi()

export const useUserAuthList = defineStore('userAuthList', {
  state: (): UserAuthState => ({
    allParams: {
      queryStr: '',
      column: '',
      order: '',
      page: 1,
      pageSize: 9999,
    },

    // 全部角色列表 用于多处下拉选择
    allRoleList: [],
    allRoleOptions: [],

    // 全部菜单列表
    allMenuList: [],
    allMenuOptions: [],

    // 全部操作权限标识
    allAuthPermissionList: [],
    allAuthPermissionOptions: []
  }),
  actions: {
    // updata 操作这些列表之后即使更新全部数据
    // 获取全部角色列表 
    async getAllRoleList(updata?: boolean) {
      // 当已经存在则直接返回
      if (this.allRoleList.length && this.allRoleOptions.length && !updata) return
      try {
        const params = {
          ...this.allParams
        }
        const { data: res } = await getRoleList(params)
        const { code, message, data } = res
        if (code !== 200 || message !== 'Success') {
          this.allRoleList = []
          this.allRoleOptions = []
        } else {
          this.allRoleList = data
          this.allRoleOptions = data.map(({ roleName, id }: any) => ({ label: roleName, value: id }))
        }
      } catch (e) {
        this.allRoleList = []
        this.allRoleOptions = []
        throw e
      }
    },
    // 获取全部菜列表
    async getAllMenuList(updata?: boolean) {
      if (this.allMenuList.length && this.allMenuOptions.length && !updata) return
      try {
        const params = {
          ...this.allParams
        }
        const { data: res } = await getMenuList(params)
        const { code, message, data } = res
        if (code !== 200 || message !== 'Success') {
          this.allMenuList = []
          this.allMenuOptions = []
        } else {
          this.allMenuList = data
          this.allMenuOptions = data.map(({ menuName, menuIcon, id }: any) => ({ label: menuName, value: id, icon: menuIcon }))
        }
      } catch (e) {
        this.allAuthPermissionList = []
        this.allAuthPermissionOptions = []
        throw e
      }
    },
    // 获取全部权限标识列表
    async getAllAuthPermissionList(updata?: boolean) {
      if (this.allAuthPermissionList.length && this.allAuthPermissionOptions && !updata) return
      try {
        const params = { ...this.allParams }
        const { data: res } = await getAuthPermissionList(params)
        const { code, message, data } = res
        if (code !== 200 || message !== 'Success') {
          this.allAuthPermissionList = []
          this.allAuthPermissionOptions = []
        } else {
          this.allAuthPermissionList = data
          this.allAuthPermissionOptions = data.map(({ permissionName, id }: any) => ({ label: permissionName, value: id }))
        }
      } catch (e) {
        this.allAuthPermissionList = []
        this.allAuthPermissionOptions = []
        throw e
      }
    }
  }
})