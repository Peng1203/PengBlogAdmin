import { RouteRecordRaw } from "vue-router"
import { allAuthRoutes } from './authRoutes'
import { router } from './index'
import { Session } from "@/utils/storage"
import { useRoutesList } from '/@/stores/routesList';
import pinia from '@/stores/index';
import { useTagsViewRoutes } from "@/stores/tagsViewRoutes";
import Cookies from 'js-cookie';


/**
 * 处理 登录用户的路由表  
 * @author Peng
 * @date 2023-03-18
 * @returns {any}
 */
export function handleUserAuthRouters(): string {
  const storesRoutesList = useRoutesList(pinia)

  const storesTagsView = useTagsViewRoutes(pinia);

  const userInfo = Session.get('userInfo')

  const { id, userName } = userInfo

  // 当登录 用户为 admin 用户是不进行菜单处理直接添加全部权限路由
  if (id === 1 && userName === 'admin' && Cookies.get('userName') === 'admin') {
    allAuthRoutes.forEach((route: RouteRecordRaw) => router.addRoute(route))
    storesRoutesList.setRoutesList(allAuthRoutes[0].children as any);
    storesTagsView.setTagsViewRoutes((allAuthRoutes[0].children as any))
    // console.log('哈哈哈哈长度 -----', storesRoutesList.routesList.length)
    console.log('router -----', router)
    // 返回第一个跳转后第一个展示的菜单展示
    return (allAuthRoutes[0].children as any)[0].name
  } else {
    console.log('router -----', router)
    console.log('其他用户 -----',)
    return ''
  }
}