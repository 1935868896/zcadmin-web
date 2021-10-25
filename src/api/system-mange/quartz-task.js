import request from '@/utils/request'
// 查
export function fetchList(query) {
  return request({
    url: '/quartz/quartzJob/page',
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
// 暂时
export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
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

export function update(data) {
  return request({
    url: '/project/bookInfo',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/project/bookInfo',
    method: 'put',
    data
  })
}
