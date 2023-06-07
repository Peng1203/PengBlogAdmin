/* eslint-disable */
import * as axios from 'axios'

// 扩展 axios 数据返回类型，可自行扩展
declare module 'axios' {
  export interface AxiosResponse<T = any> {
    code: number
    status: number
    statusText: string
    headers: any
    data: T
    [key: string]: T
  }
  export type RequestListParams<T = any> = {
    page: number
    pageSize: number
    queryStr: string
    column: string
    order: string
    [key: string]: T
  }
}
