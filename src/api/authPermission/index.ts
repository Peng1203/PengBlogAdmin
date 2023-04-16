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
  }
}