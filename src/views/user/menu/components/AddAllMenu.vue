<template>
  <el-button
    v-auth="'ADD'"
    size="default"
    type="success"
    class="ml10"
    @click="handleAddAllMenu"
  >
    <el-icon>
      <Menu />
    </el-icon>
    一键添加默认菜单
  </el-button>
</template>

<script lang="ts" setup>
import { allAuthRoutes } from '@/router/authRoutes'
import { formatFlatteningRoutes } from '@/router/index'
import { useMenuApi } from '@/api/menu/index'

const { addAllDefaultMenu } = useMenuApi()

const handleAddAllMenu = () => {
  const allMenuRules = formatFlatteningRoutes(allAuthRoutes).filter(
    (rule: any) => rule.name !== 'Index'
  )

  const data = allMenuRules.map((item: any) => ({
    menuName: item.meta.title,
    menuPath: item.path,
    menuIcon: item.meta.icon,
    menuURI: item.name,
    parentId: 0,
    menuType: item.meta.menuType,
    menuRedirect: item?.redirect?.name || '',
    otherConfig: {
      isKeepAlive: item.meta.isKeepAlive,
      isHide: item.meta.isHide,
      parentMenuName: item.meta?.parentMenuName || '',
    },
    // otherConfig: JSON.stringify({
    //   isKeepAlive: item.meta.isKeepAlive,
    //   isHide: item.meta.isHide,
    //   parentMenuName: item.meta?.parentMenuName || '',
    // }),
  }))

  console.log(
    `%c data ----`,
    'color: #fff;background-color: #000;font-size: 18px',
    data
  )

  addDefaultMenus(data)
}

const addDefaultMenus = async (data: any[]) => {
  try {
    const { data: res } = await addAllDefaultMenu(data)
    console.log('res -----', res)
  } catch (e) {
    console.log('e -----', e)
  }
}
</script>

<style lang="scss" scoped></style>
