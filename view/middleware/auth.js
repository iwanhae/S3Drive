export default function({ store, redirect }) {
  // 사용자가 인증을 하지 않은 경우.
  if (!store.state.auth.id) {
    const id = window.localStorage.getItem('id')
    if (id) {
      store.commit('auth/setId', id)
    } else return redirect('/')
  }
}
