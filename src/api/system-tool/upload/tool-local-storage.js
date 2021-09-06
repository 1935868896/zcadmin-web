import request from '@/utils/request'
// 分页查
export function fetchList(query) {
  return request({
    url: '/tool/localStorage/page',
    method: 'get',
    params: query
  })
}
// 根据主键查询
export function fetchDetail(id) {
  return request({
    url: '/tool/localStorage/id',
    method: 'get',
    params: { id }
  })
}

// 创建
export function create(data) {
  return request({
    url: '/tool/localStorage',
    method: 'post',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/tool/localStorage',
    method: 'put',
    data
  })
}
// 删除
export function deleteData(id) {
  return request({
    url: '/tool/localStorage',
    method: 'delete',
    params: { id }
  })
}

