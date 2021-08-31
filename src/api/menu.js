import request from '@/utils/request'

export function getMenu() {
  return request({
    baseURL: 'http://localhost:8080',
    url: '/sysMenu', // 假地址 自行替换
    method: 'get'
  })
}
