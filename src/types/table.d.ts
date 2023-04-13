declare interface PengTableAttribute {
  data: any[]
  columns: ColumnItem[]
  border?: boolean
  isSelection?: boolean
  checkBoxIsEnableCallBack?: function
  loading?: boolean
  isFilterShowColumn?: boolean
  isNeedPager?: boolean
  pagerInfo?: PageInfo
}
// 表格column 可选项
declare interface ColumnItem {
  label: string
  prop: string
  width?: number | string | 'auto'
  minWidth?: number | string
  sort?: boolean | 'custom'
  tooltip?: boolean
  fixed?: boolean | 'left' | 'right'
  slotName?: string
  align?: 'left' | 'center' | 'right'
  childrenColumns?: ColumnItem[]
}

declare interface PageInfo {
  page: number,
  pageSize: number,
  total: number,
  pageSizeList?: number[]
}