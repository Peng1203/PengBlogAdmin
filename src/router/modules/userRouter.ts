import { RouteRecordRaw } from 'vue-router'

// 用户管理路由规则
const routerRules: RouteRecordRaw[] = [
  {
    path: '/user',
    name: 'User',
    redirect: { name: 'SystemUser' },
    // component: () => import('@/layout/routerView/parent.vue'),
    meta: {
      title: '用户管理',
      isLink: '',
      isHide: false,
      isKeepAlive: false,
      isAffix: false,
      isIframe: false,
      icon: 'iconfont icon-jiaoseguanli',
      menuType: '1',
    },
    children: [
      {
        path: '/user/list',
        name: 'SystemUser',
        component: () => import('@/views/user/user/index.vue'),
        meta: {
          parentMenuName: 'User',
          title: '用户列表',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          icon: 'iconfont icon-yonghuguanli',
          menuType: '4',
        },
      },
    ],
  },
]

export default routerRules
