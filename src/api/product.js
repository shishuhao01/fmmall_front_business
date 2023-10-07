import request from '@/utils/request'

export function getList(pageNum,pageSize) {
  return request({
    url: `/products?pageNum=${pageNum}&&pageSize=${pageSize}`,
    method: 'get',
  })
}


export function selectOne(id) {
    return request({
      url: `/products/${id}`,
      method: 'get',
    })
  }
  export function updateOne(product) {
    return request({
      url: `/products/update`,
      method: 'put',
      data:product,
    })
  }

  export function delOne(id) {
    return request({
      url: `/products/${id}`,
      method: 'delete',
    })
  }

  export function selectByName(name) {
    return request({
      url: `/products/name?name=${name}`,
      method: 'get',
    })
  }