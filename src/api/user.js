import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/system/login',
    // url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/vue-element-admin/user/info',
    url: '/system/userinfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
