import axios from 'axios'
import supportMetaCancelToken from './supportMetaCancelToken'
// import store from '../store'

// 创建 api 实例
const apiAxios = new Proxy(axios.create({
  // https://cn.vitejs.dev/guide/env-and-mode.html
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || '/',
  timeout: 1000 * 60
}), {
  get(target, ...args) {
    return Reflect.get(target, ...args) || Reflect.get(axios, ...args)
  }
})
//apiAxios.CancelToken = axios.CancelToken
//apiAxios.isCancel = axios.isCancel
//Object.keys(axios).forEach(key => {
//  if (axios.hasOwnProperty(key) && !apiAxios.hasOwnProperty(key)) {
//    apiAxios[key] = axios[key]
//  }
//})
apiAxios.defaults.meta = {
  // 请求重试
  retry: 1/*times*/, retryDelay: 100/*ms*/, curRetry: 0/*times*/,
  // 断开相同请求，判断条件 如果!!cancelToken存在则计算config.url+cancelToken的值作为唯一key值，key值相同，则断开之前请求
  cancelToken: '',
}
// 设置 post 请求头
apiAxios.defaults.headers.post['Content-Type'] = 'application/json'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

supportMetaCancelToken(apiAxios)

// 请求拦截
apiAxios.interceptors.request.use(config => {
  // let accessToken = store.state.user.accessToken
  // if (accessToken) {
  //   config.headers.Authorization = `Bearer ${ accessToken }`
  // }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
apiAxios.interceptors.response.use(res => {
  // 请求成功
  return Promise.resolve(res)
}, error => {
  // 请求失败
  if (axios.isCancel(error)) {
    console.error('主动取消')
  } else {
    const config = error.config
    if (config.meta && config.meta.curRetry !== config.meta.retry) {
      config.meta.curRetry++
      return new Promise(resolve => {
        setTimeout(() => {
          console.warn(`${config.url},请求重试: ${config.meta.curRetry}次`)
          resolve(apiAxios(config))
        }, config.meta.retryDelay, 1000)
      })
    }
  }
  return Promise.reject(error)
})
export default apiAxios