import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 300000,
  withCredentials: true // send cookies when cross-domain requests
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.code === 1234) {
      const config = response.config
      if (!isRefreshing) {
        isRefreshing = true
        return refreshToken().then(res => {
          const token = res
          console.log(token)
          service.defaults.headers['X-Token'] = token
          config.headers['X-Token'] = token
          setToken(token)
          config.baseURL = ''
          // 已经刷新了token，将所有队列中的请求进行重试
          requests.forEach(cb => cb(token))
          requests = []
          return service(config)
        }).catch(res => {
          console.error('refreshtoken error =>', res)
          window.location.href = '/'
        }).finally(() => {
          isRefreshing = false
        })
      } else {
        // 正在刷新token，将返回一个未执行resolve的promise
        return new Promise((resolve) => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push((token) => {
            config.baseURL = process.env.VUE_APP_BASE_API
            config.headers['X-Token'] = token
            resolve(service(config))
          })
        })
      }
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code === 200) {
      console.log(res)
      return res
    }
    if (res.code !== 20000) {
      Message({
        message: res.data || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

function refreshToken() {
  // instance是当前request.js中已创建的axios实例
  return service.post('http://localhost:8080/system/refresh/token').then(res => res.data)
}

// 创建一个axios实例

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

export default service
