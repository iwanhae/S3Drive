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
          class="el-icon-takeaway-box"
          style="font-size:32px;margin: 10px 10px 10px 0px;"
        ></i>
        <div>
          <div>{{ bucket.Name }}</div>
          <div style="font-style: italic;color: darkgrey;">
            {{ new Date(bucket.CreationDate).toLocaleString() }}
          </div>
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
    bucket: {
      type: Object,
      default: () => {
        return { Name: '', CreationDate: '', selected: false }
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    isSelected() {
      if (this.selected[this.bucket.Name]) return true
      else return false
    }
  },
  methods: {
    onClick(e) {
      this.$emit('onClick', {
        id: this.bucket.Name,
        type: 'bucket',
        selected: this.selected,
        control: e.ctrlKey,
        shift: e.shiftKey,
        bucket: this.bucket
      })
    },
    onDBClick(e) {
      this.$router.push(
        `${this.$router.currentRoute.path}/${this.bucket.Name}/`
      )
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
