import request from '@/utils/request'
// 分页查
export function fetchList(query) {
  return request({
    url: '/system/menu/page',
    method: 'get',
    params: query
  })
}

export function getTree() {
  return request({
    url: '/system/menu/tree',
    method: 'get'
  })
}

export function getMenuByRoleId(id) {
  return request({
    url: '/system/role/getMenuByRoleId',
    method: 'get',
    params: { id }

  })
}

export function updateBatch(data) {
  return request({
    url: '/system/role/batch',
    method: 'put',
    data
  })
}

// 根据主键查询
export function fetchDetail(id) {
  return request({
    url: '/system/menu/id',
    method: 'get',
    params: { id }
  })
}

// 创建
export function create(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    data
  })
}
// 删除
export function deleteData(id) {
  return request({
    url: '/system/menu',
    method: 'delete',
    params: { id }
  })
}
