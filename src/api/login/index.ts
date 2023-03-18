import request from '@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method getCaptcha 获取用户登录验证码
 * @method verifyCaptcha 校验验证码
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useLoginApi() {
	return {
		getCaptcha: () => {
			return request({
				url: '/user/getCaptcha',
				method: 'get',
			})
		},
		verifyCaptcha: (data: object) => {
			return request({
				url: '/user/verifyCaptcha',
				method: 'post',
				data
			})
		},
		signIn: (data: object) => {
			return request({
				url: '/user/login',
				method: 'post',
				data,
			});
		},
		signOut: (data: object) => {
			return request({
				url: '/user/signOut',
				method: 'post',
				data,
			});
		},
	};
}
