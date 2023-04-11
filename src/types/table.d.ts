// 表格column 可选项
declare interface ColumnItem {
  label: string
  prop: string
  width: number | string
  minWidth?: number | string
  sort?: boolean | 'custom'
  tooltip?: boolean
  fixed?: boolean | 'left' | 'right'
  slotName?: string
  align?: 'left' | 'center' | 'right'
  childrenColumns?: ColumnItem[]
}