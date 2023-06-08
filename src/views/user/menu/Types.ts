// 菜单列表响应结构
interface MenuData {
  URIs: string[]
  code: number
  data: Menu[]
  message: MessageEnum
  total: number
}

// 菜单信息
interface Menu {
  id: number
  menuName: string
  menuIcon: string
  menuPath: string
  menuURI: string
  parentId: number
  roles: number[]
  updateTime: string
  createdTime: string
}
