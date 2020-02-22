export const state = () => ({
  id: '',
  loggedIn: false
})

export const mutations = {
  setId(state, id) {
    window.localStorage.setItem('id', id)
    state.id = id
  }
}
