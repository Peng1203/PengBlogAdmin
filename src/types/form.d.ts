declare interface OperationItem {
  label: string
  value: string | number | boolean
  [key: string]: T
}
// 封装表单formItem属性
declare interface FormItem<T = any> {
  type: string // slot input select
  label: string
  prop: string
  size?: string
  placeholder?: string
  labelItemW?: string | number
  required?: boolean
  rules?: any[]
  disabled?: boolean
  span?: number
  offset?: number
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  isShow?: boolean
  slotName?: string
  options?: OperationItem[]
  multiple?: boolean // 开启多选
  [key: string]: T
}

// 封装表单 下拉框 / switch 组件 自定义事件传递参数
declare type FormItemChangeType = {
  newVal: any
  prop: string
  index: number
}
