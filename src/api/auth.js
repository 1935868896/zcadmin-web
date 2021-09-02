import request from '@/utils/request'

export function getCodeImg() {
  return request({
    url: '/auth/code',
    method: 'get',
    baseURL: 'http://localhost:8080'
  })
}
