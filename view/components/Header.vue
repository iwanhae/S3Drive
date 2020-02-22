<template>
  <div class="header">
    <div class="container" style="flex-basis: 180px;flex-shrink: 0;">
      <nuxt-link to="/files" class="subtitle">S3Drive</nuxt-link>
    </div>
    <div class="container hide-on-mobile" style="width:100%">
      <el-autocomplete
        class="item"
        placeholder="검색"
        style="max-width:900px;width:100%;"
      >
      </el-autocomplete>
      <el-button icon="el-icon-search" circle style="margin:auto 10px;">
      </el-button>
    </div>
    <div class="container">
      <el-popover
        placement="bottom"
        width="400"
        trigger="click"
        style="margin:auto;"
      >
        <div>
          Hello World!
        </div>
        <el-button slot="reference" icon="el-icon-setting" circle> </el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  components: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped>
.container {
  display: flex;
}
.item {
  margin: auto 0px;
}
.subtitle {
  font-size: 28px;
  text-decoration: none;
  font-weight: 300;
  margin: auto;
}
.header {
  width: 100%;
  height: 100%;
  display: flex;
}
.title {
  font-size: 36px;
  text-decoration: none;
}
</style>
