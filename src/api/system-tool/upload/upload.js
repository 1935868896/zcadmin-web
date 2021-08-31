import request from '@/utils/request'
// 分页查
export function getOssToken(fileName, pathPre) {
  return request({
    url: '/zcadmin/oss',
    method: 'get',
    baseURL: 'http://localhost:8080',
    params: { fileName, pathPre }
  })
}
