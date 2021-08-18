import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/system/login',
    baseURL: 'http://localhost:8080',
    // url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/vue-element-admin/user/info',
    url: '/system/userinfo',
    baseURL: 'http://localhost:8080',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
