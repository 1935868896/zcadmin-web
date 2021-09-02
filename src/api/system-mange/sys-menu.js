import request from '@/utils/request'
// 分页查
export function fetchList(query) {
  return request({
    url: '/system/menu/page',
    method: 'get',
    baseURL: 'http://localhost:8080',
    params: query
  })
}

export function getTree() {
  return request({
    url: '/system/menu/tree',
    method: 'get',
    baseURL: 'http://localhost:8080'
  })
}

export function getMenuByRoleId(id) {
  return request({
    url: '/system/rolesMenus/roleId',
    method: 'get',
    baseURL: 'http://localhost:8080',
    params: { id }

  })
}

export function updateBatch(data) {
  return request({
    url: '/system/rolesMenus/batch',
    method: 'put',
    baseURL: 'http://localhost:8080',
    data
  })
}

// 根据主键查询
export function fetchDetail(id) {
  return request({
    url: '/system/menu/id',
    method: 'get',
    baseURL: 'http://localhost:8080',
    params: { id }
  })
}

// 创建
export function create(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    baseURL: 'http://localhost:8080',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    baseURL: 'http://localhost:8080',
    data
  })
}
// 删除
export function deleteData(id) {
  return request({
    url: '/system/menu',
    method: 'delete',
    baseURL: 'http://localhost:8080',
    params: { id }
  })
}
