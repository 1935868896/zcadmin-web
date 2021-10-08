import request from '@/utils/request'
// 分页查
export function fetchList(query, data) {
  return request({
    url: '/system/sysDictDetail/page',
    method: 'post',
    params: query,
    data
  })
}
// 根据主键查询
export function fetchDetail(id) {
  return request({
    url: '/system/sysDictDetail/id',
    method: 'get',
    params: { id }
  })
}

// 创建
export function create(data) {
  return request({
    url: '/system/sysDictDetail',
    method: 'post',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/system/sysDictDetail',
    method: 'put',
    data
  })
}
// 删除
export function deleteData(id) {
  return request({
    url: '/system/sysDictDetail',
    method: 'delete',
    params: { id }
  })
}
