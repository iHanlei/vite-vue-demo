import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig, AxiosHeaders } from "axios"
import qs from "qs"
import { useStorage } from "@/composables/useStorage"

// 环境变量
const BASE_URL = import.meta.env.VITE_API_BASE_PATH

// Storage 工具
const { getStorage } = useStorage("sessionStorage")

// 类型定义
type Recordable<T = any> = Record<string, T>

interface ApiResponse<T = any> {
  code: string
  data: T
  msg: string
}

interface AxiosConfig extends AxiosRequestConfig {
  url: string
  method: "get" | "post" | "delete" | "put"
  params?: Recordable
  data?: Recordable
  headers?: Recordable<string>
  responseType?: "json" | "blob" | "text"
}

// 把对象转为 FormData
const objToFormData = (obj: Recordable): FormData => {
  const formData = new FormData()
  Object.keys(obj).forEach(key => {
    formData.append(key, obj[key])
  })
  return formData
}

// 请求取消管理
const abortControllerMap: Map<string, AbortController> = new Map()

// 创建 Axios 实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
})

// 默认请求拦截器
axiosInstance.interceptors.request.use(config => {
  // 添加取消控制器
  const controller = new AbortController()
  const url = config.url || ""
  config.signal = controller.signal
  abortControllerMap.set(url, controller)

  // 处理不同请求格式
  if (config.method === "post") {
    if (config.headers?.["Content-Type"] === "application/x-www-form-urlencoded") {
      config.data = qs.stringify(config.data)
    } else if (config.headers?.["Content-Type"] === "multipart/form-data" && !(config.data instanceof FormData)) {
      config.data = objToFormData(config.data)
    }
  }

  // 序列化 GET 请求参数
  if (config.method === "get" && config.params) {
    config.url += `?${qs.stringify(config.params)}`
    config.params = undefined // 避免重复参数
  }

  // 添加全局 Token
  const token = getStorage("token")
  config.headers = AxiosHeaders.from({
    ...config.headers,
    Token: token ? `Bearer ${token}` : "",
  })

  return config
})

// 默认响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const url = response.config.url || ""
    abortControllerMap.delete(url)

    // 直接返回响应
    return response
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        console.error("未授权，请重新登录")
      } else if (status >= 500) {
        console.error("服务器错误，请稍后重试")
      } else {
        console.error((data as Recordable)?.message || "请求失败")
      }
    } else {
      console.error("网络错误，请检查网络连接")
    }
    return Promise.reject(error)
  }
)

// 封装请求方法
const request = <T = any>(config: AxiosConfig): Promise<T> => {
  return axiosInstance.request<ApiResponse<T>>(config).then(response => {
    const { code, msg, data } = response.data
    if (code === "200") {
      return data
    } else {
      return Promise.reject(new Error(msg || "请求失败"))
    }
  })
}

// API 工具封装
const api = {
  get: <T = any>(config: Omit<AxiosConfig, "method">): Promise<T> => request<T>({ method: "get", ...config }),
  post: <T = any>(config: Omit<AxiosConfig, "method">): Promise<T> => request<T>({ method: "post", ...config }),
  delete: <T = any>(config: Omit<AxiosConfig, "method">): Promise<T> => request<T>({ method: "delete", ...config }),
  put: <T = any>(config: Omit<AxiosConfig, "method">): Promise<T> => request<T>({ method: "put", ...config }),
  cancelRequest: (url: string | string[]) => {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      abortControllerMap.get(_url)?.abort()
      abortControllerMap.delete(_url)
    }
  },
  cancelAllRequest: () => {
    for (const [_, controller] of abortControllerMap) {
      controller.abort()
    }
    abortControllerMap.clear()
  },
}

export default api