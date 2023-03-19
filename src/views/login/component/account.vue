<template>
  <el-form
    size="large"
    ref="loginFormRef"
    class="login-content-form"
    :model="loginState.loginForm"
    :rules="loginState.loginFormRules"
  >
    <el-form-item
      prop="userName"
      class="login-animation1"
    >
      <el-input
        text
        clearable
        autocomplete="off"
        placeholder="请输入用户名"
        v-model.trim="loginState.loginForm.userName"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><ele-User /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item
      prop="password"
      class="login-animation2"
    >
      <el-input
        autocomplete="off"
        placeholder="请输入密码"
        v-model.trim="loginState.loginForm.password"
        :type="loginState.isShowPassword ? 'text' : 'password'"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><ele-Unlock /></el-icon>
        </template>
        <template #suffix>
          <i
            class="iconfont el-input__icon login-content-password"
            :class="loginState.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
            @click="loginState.isShowPassword = !loginState.isShowPassword"
          >
          </i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item
      prop="captcha"
      class="login-animation3"
    >
      <el-col :span="15">
        <el-input
          text
          clearable
          maxlength="4"
          autocomplete="off"
          placeholder="验证码 (注意区分大小写)"
          v-model.trim="loginState.loginForm.captcha"
          @keyup.native.enter="handleUserLogin"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><ele-Position /></el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="8">
        <el-button
          v-waves
          class="login-content-code"
          @click="handleRefreshCaptcha"
        >{{ captchaCode }}</el-button>
      </el-col>
    </el-form-item>
    <el-form-item class="login-animation4">
      <el-button
        round
        v-waves
        type="primary"
        class="login-content-submit"
        :loading="loginState.loading.signIn"
        @click="handleUserLogin"
      >
        <span>登 录</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="loginAccount">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElNotification, FormRules } from 'element-plus'
import { useUserInfo } from '@/stores/userInfo'
import { handleUserAuthRouters } from '@/router/handleAuthRouters'
import { Local, Session } from '@/utils/storage'
import { formatAxis } from '@/utils/formatTime'
import { NextLoading } from '@/utils/loading'
import { useLoginApi } from '@/api/login'

const { getCaptcha, verifyCaptcha, signIn } = useLoginApi()
// 定义变量内容
const useUserInfoStores = useUserInfo()
const route = useRoute()
const router = useRouter()

const loginState = reactive({
	isShowPassword: false,
	// 登录表单
	loginForm: {
		userName: 'admin',
		password: '123456',
		captcha: '',
	},
	// 登录表单校验规则
	loginFormRules: reactive<FormRules>({
		userName: [
			{ required: true, message: '用户名不能为空', trigger: 'blur' },
			{ min: 2, max: 6, message: '用户名长度在 2 到 6 位', trigger: 'blur' },
		],
		password: [
			{ required: true, message: '密码不能为空', trigger: 'blur' },
			{ min: 6, max: 15, message: '密码长度在 6 到 15 位', trigger: 'blur' },
		],
		captcha: [
			{ required: true, message: '验证码不能为空', trigger: 'blur' },
			{ min: 4, max: 4, message: '验证码长度为 4 位', trigger: 'blur' },
		],
	}),
	loading: {
		signIn: false,
	},
})

onMounted(() => {
	getLoginCaptcha()
})

// 刷新 定时器
const timer = ref<number>(0)
// 刷新验证码
const handleRefreshCaptcha = () => {
	clearTimeout(timer.value)
	// 防抖
	timer.value = setTimeout(() => {
		loginState.loginForm.captcha = ''
		getLoginCaptcha()
	}, 500)
}

// 获取登录验证码
const captchaCode = ref<string>('')
const getLoginCaptcha = async (): Promise<void> => {
	try {
		const { data: res } = await getCaptcha()
		const { code, message, data, uuid } = res
		if (code !== 200 || message !== 'Success') return
		uuid && Local.set('uuid', uuid)
		captchaCode.value = data
	} catch (error) {
		throw error
	}
}

// 校验验证码
const postCaptchaCode = async (): Promise<boolean> => {
	try {
		const params = {
			code: loginState.loginForm.captcha,
			uuid: Local.get('uuid'),
		}
		const { data: res } = await verifyCaptcha(params)
		const { data, code, message } = res
		if (code === 200 && message === 'Success') return true
		// 验证码失效 刷新验证码
		if (message === 'Expire') handleRefreshCaptcha()
		ElMessage.warning(data)
		return false
	} catch (error) {
		throw error
	}
}

// 登录 获取用户信息
const getLoginUserInfo = async (): Promise<any> => {
	try {
		const params = {
			...loginState.loginForm,
			uuid: Local.get('uuid'),
		}
		const { data: res } = await signIn(params)
		const { code, data, message, token } = res
		if (code !== 200 || message !== 'Success') return ElMessage.error(data)
		return { userInfo: data, token }
	} catch (error) {
		throw error
	}
}

const loginFormRef = ref(null) as any
// 处理登录
const handleUserLogin = async () => {
	try {
		await loginFormRef.value.validate()
		loginState.loading.signIn = true
		// 调用后端验证码校验接口
		const captchIsPass = await postCaptchaCode()
		if (!captchIsPass) return (loginState.loading.signIn = false)
		const { userInfo, token } = await getLoginUserInfo()
		// 存储 token 到浏览器缓存
		Session.set('token', token)
		Session.set('userInfo', { ...userInfo, token })
		Session.set('userName', loginState.loginForm.userName)
		useUserInfoStores.setUserInfos(userInfo)
		// 处理登录用户角色的路由表
		const showPageName = await handleUserAuthRouters()
		router.push({ name: showPageName })
		const signInText = '欢迎回来！'
		ElNotification.success({
			title: loginState.loginForm.userName,
			message: `${currentTime.value}，${signInText}`,
		})
		loginState.loading.signIn = false
	} catch (e) {
		console.log(e)
	}
}
// 时间获取
const currentTime = computed(() => {
	return formatAxis(new Date())
})
// 登录成功后的跳转
const signInSuccess = (isNoPower: boolean | undefined) => {
	console.log('isNoPower -----', isNoPower)
	if (isNoPower) {
		ElMessage.warning('抱歉，您没有登录权限')
		Session.clear()
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = currentTime.value
		// 登录成功，跳到转首页
		// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
		if (route.query?.redirect) {
			console.log('if -----')
			router.push({
				path: <string>route.query?.redirect,
				query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
			})
		} else {
			console.log('else -----')
			router.push('/')
		}
		// 登录成功提示
		const signInText = '欢迎回来！'
		ElMessage.success(`${currentTimeInfo}，${signInText}`)
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start()
	}
	loginState.loading.signIn = false
}
</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}
	.login-content-password {
		display: inline-block;
		width: 20px;
		cursor: pointer;
		&:hover {
			color: #909399;
		}
	}
	.login-content-code {
		width: 100%;
		padding: 0;
		font-weight: bold;
		letter-spacing: 5px;
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
