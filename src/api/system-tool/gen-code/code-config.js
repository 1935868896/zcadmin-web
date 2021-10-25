import request from '@/utils/request'
// 分页查
export function fetchList(query) {
  return request({
    url: '/gen/genConfig',
    method: 'get',
    params: query
  })
}

export function updateMethodConfig(data) {
  return request({
    url: '/generator/codeMethodConfig/batch',
    method: 'put',
    data
  })
}

// 修改
export function updateAndGen(tableName, data) {
  return request({
    url: '/tool/gen/updateAndGenCode/' + tableName,
    method: 'put',
    data
  })
}

// 修改
export function updateCodeGenConfig(data) {
  return request({
    url: '/gen/genConfig/codeGenConfig',
    method: 'put',
    data
  })
}

export function updateCodeColumnConfig(data) {
  return request({
    url: '/gen/genConfig/codeColumnConfig',
    method: 'put',
    data
  })
}

export function syncConfig(tableName) {
  return request({
    url: '/gen/genConfig/sync/' + tableName,
    method: 'get'
  })
}
