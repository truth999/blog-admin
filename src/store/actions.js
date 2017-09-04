import server from '../utils/axios'

// 用户信息初始化
export const init = async ({ state, commit }, user) => {
  if (!state.user) {
    const { data } = await server.get('/auth')
    if (data.code === 1) commit('INIT', { ...data.result })
  } else commit('INIT', { ...user })
}

// 登录
export const login = async ({ commit }, user) => {
  const { data } = await server.post('/login', {...user})
  if (data.code === 1) {
    window.localStorage.setItem('TOKEN', JSON.stringify(data.result))
  }
  return data
}
