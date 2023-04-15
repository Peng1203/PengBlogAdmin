import request from '@/utils/request';

export function useUserApi() {
  return {
    /**
     * 获取用户列表
     * @author Peng
     * @date 2023-04-15
     * @param {any} params:object
     * @returns {any}
     */
    getUserList(params: object) {
      return request({
        url: '/user/getUserList',
        method: 'get',
        params
      })
    },
    /**
     * 添加用户
     * @author Peng
     * @date 2023-04-15
     * @param {any} params:object
     * @returns {any}
     */
    addUser(params: object) {
      return request({
        url: '/user/addUser',
        method: 'post',
        data: params
      })
    },
    /**
     * 更新用户信息
     * @author Peng
     * @date 2023-04-15
     * @param {any} userId:number
     * @param {any} params:object
     * @returns {any}
     */
    updateUserInfo(userId: number, params: object) {
      return request({
        url: `/user/updateUserInfoById/${userId}`,
        method: 'put',
        data: params
      })
    },
    /**
     * 通过ID删除用户
     * @author Peng
     * @date 2023-04-15
     * @param {any} userId:number
     * @returns {any}
     */
    deleteUserById(userId: number) {
      return request({
        url: `/user/deleteUserById/${userId}`,
        method: 'delete',
      })
    },
    /**
     * 上传用户头像
     * @author Peng
     * @date 2023-04-03
     * @param {any} userId:number
     * @param {any} file:FormData
     * @returns {any}
     */
    uploadUserAvatar(userId: number, file: FormData) {
      return request({
        url: `/user/uploadAvatarById/${userId}`,
        method: 'patch',
        data: file,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
  }
}