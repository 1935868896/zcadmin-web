import request from '@/utils/request'
// 分页查
export function mailPost(data) {
  return request({
    url: '/email',
    method: 'post',
    data
  })
}

