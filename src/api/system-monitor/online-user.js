import request from '@/utils/request'
// 查
export function fetchList(query) {
  return request({
    url: '/online/user',
    method: 'get',
    params: query
  })
}
export function kickOut(data) {
  return request({
    url: '/user/kickOut',
    method: 'post',
    data
  })
}
