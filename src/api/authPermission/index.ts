import request from '@/utils/request'
import { listParams } from '/@/types/axios'

/**
 * 操作权限标识
 * @author Peng
 * @date 2023-04-16
 * @returns {any}
 */
export function useAuthPermissionApi() {
  return {
    /**
     * 获取权限标识列表
     * @author Peng
     * @date 2023-04-16
     * @param {any} params:listParams
     * @returns {any}
     */
    getAuthPermissionList(params: listParams) {
      return request({
        url: '/auth-permission/getAuthPermissionList',
        method: 'get',
        params,
      })
    },
    /**
     * 删除权限标识
     * @author Peng
     * @date 2023-04-17
     * @param {any} id:number
     * @returns {any}
     */
    delAuthPermission(id: number) {
      return request({
        url: `/auth-permission/deleteAuthPermById/${id}`,
        method: 'delete'
      })
    },
    /**
     * 添加权限标识
     * @author Peng
     * @date 2023-04-17
     * @param {any} params:object
     * @returns {any}
     */
    addAuthPermission(params: object) {
      return request({
        url: '/auth-permission/addAuthPermission',
        method: 'post',
        data: params
      })
    },
    /**
     * 更新权限标识信息
     * @author Peng
     * @date 2023-04-17
     * @param {any} id:number
     * @param {any} params:object
     * @returns {any}
     */
    updateAuthPermInfo(id: number, params: object) {
      return request({
        url: `/auth-permission/updateAuthPermInfoById/${id}`,
        method: 'put',
        data: params
      })
    }
  }
}