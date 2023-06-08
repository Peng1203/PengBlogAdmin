import { RouteRecordRaw } from 'vue-router'
import { allAuthRoutes } from './authRoutes'
import { router, formatFlatteningRoutes } from './index'
import { Session } from '@/utils/storage'
import { useRoutesList } from '/@/stores/routesList'
import pinia from '@/stores/index'
import { useUserInfo } from '@/stores/userInfo'
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes'
import { NextLoading } from '@/utils/loading'
// import Cookies from 'js-cookie';

/**
 * 处理 登录用户的路由表
 * 该方法会在登录成功 和 页面刷新时执行
 * @author Peng
 * @date 2023-03-18
 * @returns {any}
 */
export async function handleUserAuthRouters(): Promise<any> {
  if (window.nextLoading === undefined) NextLoading.start()

  const storesRoutesList = useRoutesList(pinia)
  const useUserInfoStores = useUserInfo()
  const storesTagsView = useTagsViewRoutes(pinia)

  const userInfo = Session.get('userInfo')
  useUserInfoStores.setUserInfos({ ...userInfo, token: Session.get('token') })

  const allRouterRules = formatFlatteningRoutes(allAuthRoutes[0].children)

  const { id, userName } = userInfo

  // 当登录 用户为 admin 用户是不进行菜单处理直接添加全部权限路由
  if (id === 1 && userName === 'admin') {
    // 将全部权限路由添加到路由规则中
    await allAuthRoutes.forEach((route: RouteRecordRaw) =>
      router.addRoute(route)
    )
    // 设置
    await storesRoutesList.setRoutesList(allAuthRoutes[0].children as any)
    await storesTagsView.setTagsViewRoutes(allRouterRules)
    // 返回第一个跳转后第一个展示的菜单展示
    NextLoading.done()
    return (allAuthRoutes[0].children as any)[0].name
  } else {
    if (window.nextLoading === undefined) NextLoading.start()
    const { menus } = userInfo
    if (!menus.length) return ''
    const handleAfterMenus: any = allAuthRoutes[0].children?.filter((menu) =>
      menus.find((item: any) => item.menuURI === menu.name)
    )

    handleAfterMenus.forEach((item: any) => {
      item.meta.icon =
        menus.find((menu: any) => menu.menuURI === item.name).menuIcon ||
        item.meta.icon
    })

    const newRule: any = allAuthRoutes
    newRule[0].children = handleAfterMenus
    await newRule.forEach((route: RouteRecordRaw) => router.addRoute(route))
    // console.log(`%c 处理后的菜单 ----`, 'color: #fff;background-color: black;font-size: 18px', handleAfterMenus)
    // console.log('allAuthRoutes -----', userInfo, allAuthRoutes)
    // 设置
    await storesRoutesList.setRoutesList(newRule[0].children)
    await storesTagsView.setTagsViewRoutes(allRouterRules)
    // 返回第一个跳转后第一个展示的菜单展示
    NextLoading.done()
    return (newRule[0].children as any)[0].name
  }
}
