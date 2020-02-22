<template>
  <div class="container">
    <el-container style="height:100vh">
      <el-header style="display:flex"><Header /></el-header>
      <el-container>
        <el-aside width="200px"> <Aside /> </el-aside>
        <el-main style="height: calc(100vh - 60px);">
          <Body :path="path"></Body>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from '~/components/Header'
import Aside from '~/components/Aside'
import Body from '~/components/Body'
export default {
  components: {
    Header,
    Aside,
    Body
  },
  data() {
    return {
      path: '',
      width: 200
    }
  },
  beforeMount() {
    this.path = this.$route.params.pathMatch || ''
  },
  methods: {
    onDrag(e) {}
  }
}
</script>

<style scoped>
.draggable {
  cursor: e-resize !important;
  float: right;
  width: 5px;
  height: 100%;
  background: gray;
}
.draggable :hover {
  cursor: e-resize !important;
}
</style>
