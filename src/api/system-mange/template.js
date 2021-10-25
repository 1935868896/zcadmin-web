import request from '@/utils/request'
// 查
export function fetchList(query) {
  return request({
    url: '/project/bookInfo/page',
    method: 'get',
    params: query

  })
}
// 根据主键查询
export function fetchDetail(id) {
  return request({
    url: '/project/bookInfo/id',
    method: 'get',
    params: { id }
  })
}

// 创建
export function create(data) {
  return request({
    url: '/project/bookInfo',
    method: 'post',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/project/bookInfo',
    method: 'put',
    data
  })
}
// 删除
export function deleteData(id) {
  return request({
    url: '/project/bookInfo',
    method: 'delete',
    params: { id }
  })
}
