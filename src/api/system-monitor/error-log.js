import request from '@/utils/request'
// 查
export function fetchList(query) {
  return request({
    url: '/api/logs',
    method: 'get',
    baseURL: 'http://localhost:8080',
    params: query
  })
}
export function getErrDetail(id) {
  return request({
    url: 'api/logs/error/' + id,
    baseURL: 'http://localhost:8080',
    method: 'get'
  })
}
