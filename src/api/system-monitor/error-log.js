import request from '@/utils/request'
// 查
export function fetchList(query, data) {
  return request({
    url: '/api/logs',
    method: 'post',
    params: query,
    data
  })
}
export function getErrDetail(id) {
  return request({
    url: 'api/logs/error/' + id,
    method: 'get'
  })
}
