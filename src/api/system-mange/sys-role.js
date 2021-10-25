import request from '@/utils/request'
// 分页查
export function fetchList(query) {
  return request({
    url: '/system/role',
    method: 'get',
    params: query
  })
}
export function getAllRoles() {
  return request({
    url: '/system/role',
    method: 'get'

  })
}

// 根据主键查询
export function fetchDetail(id) {
  return request({
    url: '/system/role/id',
    method: 'get',
    params: { id }
  })
}

// 创建
export function create(data) {
  return request({
    url: '/system/role',
    method: 'post',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/system/role',
    method: 'put',
    data
  })
}
// 删除
export function deleteData(id) {
  return request({
    url: '/system/role',
    method: 'delete',
    params: { id }
  })
}
