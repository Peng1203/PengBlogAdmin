/* eslint-disable */
import * as axios from 'axios';

// 扩展 axios 数据返回类型，可自行扩展
declare module 'axios' {
	export interface AxiosResponse<T = any> {
		code: number;
		data: T;
		message: string;
		type?: string;
		[key: string]: T;
	}
}

declare type listParams = {
	page: number
	pageSize: number
	queryStr: string
	column: string
	order: string
	[key: string]: T
}