import request from '@/utils/request'

export function getMenu() {
  return request({
    url: '/sysMenu', // 假地址 自行替换
    method: 'get'
  })
}
