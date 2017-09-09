import ax from './axios'

// 登录
export function login (data) {
  return ax.post('/login', { ...data })
        .then(res => res.data)
}

// 获取用户信息
export function getAuth () {
  return ax.get('/auth')
        .then(res => res.data)
}

// 修改用户信息
export function putAuth (data) {
  console.log(data)
  return ax.put('/auth', { ...data })
        .then(res => res.data)
}

// 七牛
export function getQiniu () {
  return ax.get('/qiniu')
        .then(res => res.data)
}

// 获取网站配置项
export function getOpt () {
  return ax.get('/option')
        .then(res => res.data)
}

// 修改网站配置项
export function putOpt (data) {
  return ax.put('/option', { ...data })
        .then(res => res.data)
}

// 英雄版列表
export function getHero (params) {
  return ax.get('/hero', { params })
        .then(res => res.data)
}

// 删除英雄榜
export function deleteHero (data) {
  return ax.delete(`/hero/${data._id}`)
        .then(res => res.data)
}

// 英雄版状态
export function patchHero (data) {
  return ax.patch('/hero', { ...data })
        .then(res => res.data)
}

