import request from '@/utils/request';
import { listParams } from '/@/types/axios'

export function useMenuApi() {
	return {
		/**
		 * 获取菜单列表
		 * @author Peng
		 * @date 2023-04-18
		 * @param {any} params:listParams
		 * @returns {any}
		 */
		getMenuList(params: listParams) {
			return request({
				url: '/menu/getMenuList',
				method: 'get',
				params
			})
		},
		/**
		 * 添加菜单
		 * @author Peng
		 * @date 2023-04-18
		 * @param {any} params:object
		 * @returns {any}
		 */
		addMenu(params: object) {
			return request({
				url: '/menu/addMenu',
				method: 'post',
				data: params
			})
		},
		/**
		 * 删除菜单
		 * @author Peng
		 * @date 2023-04-18
		 * @param {any} id:number
		 * @param {any} params:object
		 * @returns {any}
		 */
		deleteMenu(id: number) {
			return request({
				url: `/menu/deleteMenuById/${id}`,
				method: 'delete',
			})
		},
		/**
		 * 更新菜单信息
		 * @author Peng
		 * @date 2023-04-18
		 * @param {any} id:number
		 * @param {any} params:object
		 * @returns {any}
		 */
		updataMenu(id: number, params: object) {
			return request({
				url: `/menu/updateMenuById/${id}`,
				method: 'put',
				data: params
			})
		}
	}
}
