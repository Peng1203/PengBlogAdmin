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
      // 权限管理
      {
        path: '/auth',
        name: 'Auth',
        redirect: { name: 'SystemRole' },
        // component: () => import('@/layout/routerView/parent.vue'),
        meta: {
          title: '权限管理',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'iconfont icon-auth',
          // icon: 'ele-Edit',
        },
        children: [
          {
            path: '/auth/role',
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
            path: '/auth/menu',
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
            path: '/auth/authPermission',
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
              // icon: 'iconfont icon-permissions-o',
              icon: 'ele-Key',
            },
          },
        ],
      },
      // 用户管理
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
          roles: ['admin'],
          icon: 'iconfont icon-jiaoseguanli',
        },
        children: [
          {
            path: '/user/list',
            name: 'SystemUser',
            component: () => import('@/views/user/user/index.vue'),
            meta: {
              title: '用户列表',
              isLink: '',
              isHide: false,
              isKeepAlive: false,
              isAffix: false,
              isIframe: false,
              roles: ['admin'],
              icon: 'iconfont icon-yonghuguanli',
            },
          },
        ],
      },
      // 文章管理
      {
        path: '/article',
        name: 'Article',
        redirect: { name: 'ArticleList' },
        meta: {
          title: '文章管理',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          // icon: 'iconfont icon-wenzhangfenlei1',
          icon: 'iconfont icon-wenzhangfenlei2',
        },
        children: [
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
            path: '/article/list',
            name: 'ArticleList',
            component: () => import('@/views/article/article/index.vue'),
            meta: {
              title: '文章列表',
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
        ],
      },
      // 个人中心
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
