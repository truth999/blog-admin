import { success, error } from '../utils/response'
import service from '../api'

// 登录
export const login = async ({ commit }, user) => {
  const res = await service.login({...user})
  if (res.code === 1) {
    window.localStorage.setItem('TOKEN', JSON.stringify(res.result))
    success('登录成功')
  } else error(res.message)
  return res
}

// 用户信息初始化
export const init = async ({ state, commit }, user) => {
  if (!state.user) {
    const res = await service.getAuth()
    if (res.code === 1) commit('INIT', { ...res.result })
  } else commit('INIT', { ...user })
}

// 修改用户信息
export const putAuth = async ({ commit }, data) => {
  const res = await service.putAuth({...data})
  if (res.code !== 1) error(res.message)
  else success('修改用户信息成功')
  return res
}

// 七牛
export const getQiniu = async ({ commit }) => {
  const res = await service.getQiniu()
  return res
}

// 获取网站基本信息
export const getOpt = async ({ commit }) => {
  const res = await service.getOpt()
  if (res.code !== 1) error(res.message)
  return res
}

// 更改网站基本信息
export const putOpt = async ({ commit }, data) => {
  const res = await service.putOpt({...data})
  if (res.code !== 1) error(res.message)
  else success('修改网站信息成功')
  return res
}

// 英雄版列表
export const getHero = async ({ commit }, params = { current_page: 1 }) => {
  const res = await service.getHero(params)
  return res
}

// 删除英雄版
export const deleteHero = async ({ commit }, data) => {
  const res = await service.deleteHero(data)
  if (res.code !== 1) error(res.message)
  else success('删除数据成功')
  return res
}

export const patchHero = async ({ commit }, data) => {
  const res = await service.patchHero(data)
  if (res.code !== 1) error(res.message)
  return res
}
