import request from '@/utils/request'
// 查
export function fetchList(query) {
  return request({
    url: '/online/user',
    method: 'get',
    baseURL: 'http://localhost:8080',
    params: query
  })
}
export function kickOut(data) {
  return request({
    url: '/user/kickOut',
    baseURL: 'http://localhost:8080',
    method: 'post',
    data
  })
}
