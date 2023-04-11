import request from '@/utils/request';

export function useUserApi() {
  return {
    getUserList(params: object) {
      return request({
        url: '/user/getUserList',
        method: 'get',
        params
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