import axios, { AxiosInstance } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Session, Local } from '/@/utils/storage';
import qs from 'qs';
import { BASE_URL } from '/@/api/baseURL'
// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	// baseURL: import.meta.env.VITE_API_URL,
	baseURL: BASE_URL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
	paramsSerializer: {
		serialize(params) {
			return qs.stringify(params, { allowDots: true });
		},
	},
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		const token = Session.get('token')
		const uuid = Local.get('uuid')
		uuid && (config.headers!['uuid'] = uuid)
		token && (config.headers!['Authorization'] = token)

		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	response => {
		return response
	},
	error => {
		console.log('error -----', error)
	}
);

// 导出 axios 实例
export default service;
