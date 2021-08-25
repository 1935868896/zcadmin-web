import request from '@/utils/request'
// 查
export function fetchList(query) {
  return request({
    url: '/quartz/quartzJob/page',
    method: 'get',
    baseURL: 'http://localhost:8080',
    params: query

  })
}
// 根据主键查询
export function fetchDetail(id) {
  return request({
    url: '/project/bookInfo/id',
    method: 'get',
    baseURL: 'http://localhost:8080',
    params: { id }
  })
}
// 暂时
export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    baseURL: 'http://localhost:8080',
    params: { pv }
  })
}
// 创建
export function create(data) {
  return request({
    url: '/project/bookInfo',
    method: 'post',
    baseURL: 'http://localhost:8080',
    data
  })
}

export function update(data) {
  return request({
    url: '/project/bookInfo',
    method: 'put',
    baseURL: 'http://localhost:8080',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/project/bookInfo',
    method: 'put',
    baseURL: 'http://localhost:8080',
    data
  })
}
