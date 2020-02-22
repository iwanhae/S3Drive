<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        S3Drive
      </h1>
      <div class="holder">
        <el-input v-model="id" class="item" placeholder="id" clearable>
        </el-input>
        <el-input
          v-model="pw"
          class="item"
          placeholder="password"
          show-password
        >
        </el-input>
        <el-button
          type="primary"
          :loading="loading"
          class="item"
          plain
          @click="login()"
          >Login</el-button
        >
      </div>
      <h2 class="subtitle">
        Web based S3 explorer
      </h2>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
/* eslint-disable no-console */

export default {
  components: { Logo },
  data() {
    return {
      id: '',
      pw: '',
      loading: false
    }
  },
  mounted() {
    this.login()
  },
  methods: {
    async login() {
      try {
        this.loading = true
        const data = await this.$axios.$post('/auth', {
          id: this.id,
          pw: this.pw
        })
        this.id = data.id
        this.$message({
          type: 'success',
          message: `돌아오신걸 환영합니다 ${this.id}님!`
        })
        this.$store.commit('auth/setId', data.id)
        this.$router.push('/files')
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 500:
              this.$message({
                type: 'error',
                message: `알수없는 서버에러 입니다.`
              })
              break
            case 401:
              this.$message({
                type: 'error',
                message: `ID와 PW를 다시한번 확인해주세요.`
              })
              break
            default:
              this.$message({
                type: 'error',
                message: `현재 서버가 재구성중입니다. 잠시 후 다시시도해주세요.`
              })
          }
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          this.$message({
            type: 'error',
            message: `서버로부터 응답을 받을 수 없습니다. ${error.message}`
          })
          console.log(error.request)
        } else {
          this.$message({
            type: 'error',
            message: `클라이언트 에러입니다. ${error.message}`
          })
          console.log('Error', error.message)
        }
        this.$router.push('/')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.holder {
  max-width: 256px;
  margin: auto;
}
.holder .item {
  margin-bottom: 7px;
  width: 100%;
}
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
