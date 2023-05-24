import { RouteRecordRaw } from 'vue-router'

/**
 * 需要权限的路由表
 * @author Peng
 * @date 2023-03-18
 */

// name 属性为菜单的唯一标识

export const allAuthRoutes: Array<RouteRecordRaw> = [
  {
    path: '/index',
    name: 'Index',
    redirect: '/home',
    component: () => import('@/layout/index.vue'),
    meta: {
      isKeepAlive: false,
    },
    children: [
      // {
      //   path: '/role',
      //   name: 'Role',
      //   component: () => import('@/views/user/role/index.vue'),
      //   meta: {
      //     title: '角色管理',
      //     isLink: '',
      //     isHide: false,
      //     isKeepAlive: false,
      //     isAffix: false,
      //     isIframe: false,
      //     roles: ['admin'],
      //     icon: 'ele-ColdDrink',
      //   },
      // },
      // {
      //   path: '/system',
      //   name: 'system',
      //   component: () => import('@/layout/routerView/parent.vue'),
      //   meta: {
      //     title: '系统设置',
      //     isLink: '',
      //     isHide: false,
      //     isKeepAlive: false,
      //     isAffix: false,
      //     isIframe: false,
      //     roles: ['admin'],
      //     icon: 'iconfont icon-xitongshezhi',
      //   },
      //   // children: [
      //   //   {
      //   //     path: '/system/menu',
      //   //     name: 'systemMenu',
      //   //     component: () => import('@/views/user/menu/index.vue'),
      //   //     meta: {
      //   //       title: '菜单管理',
      //   //       isLink: '',
      //   //       isHide: false,
      //   //       isKeepAlive: false,
      //   //       isAffix: false,
      //   //       isIframe: false,
      //   //       roles: ['admin'],
      //   //       icon: 'iconfont icon-caidan',
      //   //     },
      //   //   },
      //   //   {
      //   //     path: '/system/role',
      //   //     name: 'systemRole',
      //   //     component: () => import('@/views/user/role/index.vue'),
      //   //     meta: {
      //   //       title: '角色管理',
      //   //       isLink: '',
      //   //       isHide: false,
      //   //       isKeepAlive: false,
      //   //       isAffix: false,
      //   //       isIframe: false,
      //   //       roles: ['admin'],
      //   //       icon: 'ele-ColdDrink',
      //   //     },
      //   //   },
      //   //   {
      //   //     path: '/system/user',
      //   //     name: 'systemUser',
      //   //     component: () => import('@/views/user/user/index.vue'),
      //   //     meta: {
      //   //       title: '用户管理',
      //   //       isLink: '',
      //   //       isHide: false,
      //   //       isKeepAlive: false,
      //   //       isAffix: false,
      //   //       isIframe: false,
      //   //       roles: ['admin'],
      //   //       icon: 'iconfont icon-icon-',
      //   //     },
      //   //   },
      //   //   {
      //   //     path: '/system/dept',
      //   //     name: 'systemDept',
      //   //     component: () => import('@/views/user/dept/index.vue'),
      //   //     meta: {
      //   //       title: '部门管理',
      //   //       isLink: '',
      //   //       isHide: false,
      //   //       isKeepAlive: false,
      //   //       isAffix: false,
      //   //       isIframe: false,
      //   //       roles: ['admin'],
      //   //       icon: 'ele-OfficeBuilding',
      //   //     },
      //   //   },
      //   //   {
      //   //     path: '/system/dic',
      //   //     name: 'systemDic',
      //   //     component: () => import('@/views/user/dic/index.vue'),
      //   //     meta: {
      //   //       title: '字典管理',
      //   //       isLink: '',
      //   //       isHide: false,
      //   //       isKeepAlive: false,
      //   //       isAffix: false,
      //   //       isIframe: false,
      //   //       roles: ['admin'],
      //   //       icon: 'ele-SetUp',
      //   //     },
      //   //   },
      //   // ],
      // },
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          isHide: false,
          isAffix: true,
          isKeepAlive: false,
          roles: ['admin', 'common'],
          icon: 'ele-HomeFilled',
        },
      },
      {
        path: '/menu',
        name: 'SystemMenu',
        component: () => import('@/views/user/menu/index.vue'),
        meta: {
          title: '菜单管理',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'ele-Menu',
        },
      },
      {
        path: '/role',
        name: 'SystemRole',
        component: () => import('@/views/user/role/index.vue'),
        meta: {
          title: '角色管理',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'iconfont icon-jiaoseguanli1',
        },
      },
      {
        path: '/authPermission',
        name: 'SystemAuthPermission',
        component: () => import('@/views/user/authPermission/index.vue'),
        meta: {
          title: '权限标识',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'iconfont icon-permissions-o',
        },
      },
      {
        path: '/user',
        name: 'SystemUser',
        component: () => import('@/views/user/user/index.vue'),
        meta: {
          title: '用户管理',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'iconfont icon-yonghuguanli',
        },
      },
      {
        path: '/tag',
        name: 'Tag',
        component: () => import('@/views/article/tag/index.vue'),
        meta: {
          title: '标签管理',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'iconfont icon-tags',
        },
      },
      {
        path: '/category',
        name: 'Category',
        component: () => import('@/views/article/category/index.vue'),
        meta: {
          title: '分类管理',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'iconfont icon-fenlei',
        },
      },
      {
        path: '/article',
        name: 'Article',
        component: () => import('@/views/article/article/index.vue'),
        meta: {
          title: '文章管理',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'iconfont icon-wenzhangguanli',
        },
      },
      {
        path: '/writeArticle/:aid',
        name: 'WriteArticle',
        component: () => import('@/views/article/writeArticle/index.vue'),
        meta: {
          title: '写文章',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          // icon: 'iconfont icon-tianchongxing-',
          icon: 'iconfont icon-weibiaoti--',
        },
      },
      {
        path: '/personal',
        name: 'Personal',
        component: () => import('/@/views/personal/index.vue'),
        meta: {
          title: '个人中心',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          roles: ['admin', 'common'],
          icon: 'ele-UserFilled',
        },
      },
    ],
  },
]
