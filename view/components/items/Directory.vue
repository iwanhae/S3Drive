<template>
  <div @click="onClick" @dblclick="onDBClick">
    <el-card
      shadow="hover"
      :class="{
        card: true,
        selected: isSelected
      }"
    >
      <div style="display:flex">
        <i
          class="el-icon-folder"
          style="font-size:32px;margin: 10px 10px 10px 0px;"
        ></i>
        <div>
          <div>{{ name }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  props: {
    selected: {
      type: Object,
      default: () => {}
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    isSelected() {
      if (this.selected[this.name]) return true
      else return false
    }
  },
  methods: {
    onClick(e) {
      this.$emit('onClick', {
        id: this.name,
        type: 'directory',
        selected: this.selected,
        control: e.ctrlKey,
        shift: e.shiftKey
      })
    },
    onDBClick(e) {
      this.$router.push(`${this.$router.currentRoute.path}/${this.name}/`)
    }
  }
}
</script>
<style scoped>
.card {
  width: 300px;
  margin: 10px;
  cursor: pointer;
}
.selected {
  background: #409eff;
  color: white;
}
</style>
