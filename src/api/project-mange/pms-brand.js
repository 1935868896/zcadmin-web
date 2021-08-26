import request from '@/utils/request'
// 分页查
export function fetchList(query) {
  return request({
    url: '/project/brand/page',
    method: 'get',
    baseURL: 'http://localhost:8080',
    params: query
  })
}
// 根据主键查询
export function fetchDetail(id) {
  return request({
    url: '/project/brand/id',
    method: 'get',
    baseURL: 'http://localhost:8080',
    params: { id }
  })
}

// 创建
export function create(data) {
  return request({
    url: '/project/brand',
    method: 'post',
    baseURL: 'http://localhost:8080',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/project/brand',
    method: 'put',
    baseURL: 'http://localhost:8080',
    data
  })
}
// 删除
export function deleteData(id) {
  return request({
    url: '/project/brand',
    method: 'delete',
    baseURL: 'http://localhost:8080',
    params: { id }
  })
}
