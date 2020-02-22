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
          :class="filename2Icon(obj.key)"
          style="font-size:32px;margin: 10px 10px 10px 0px;"
        ></i>
        <div>
          <div>{{ obj.key }}</div>
          <div>{{ new Date(obj.LastModified).toLocaleString() }}</div>
          <div>{{ bytes2Readable(obj.Size) }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
const filename2Icon = (fileName) => {
  const ext = fileName.substr(fileName.lastIndexOf('.') + 1)
  if ('zip tar 7z rar'.includes(ext)) return 'el-icon-box'
  if ('avi mp4 mkv'.includes(ext)) return 'el-icon-film'
  if ('mp3 aac flac'.includes(ext)) return 'el-icon-service'
  if ('jpg jpeg png bmp gif'.includes(ext)) return 'el-icon-picture-outline'
  if ('txt md html'.includes(ext)) return 'el-icon-document'
  return 'el-icon-tickets'
}
const bytes2Readable = (bytes) => {
  if (bytes < 800) return `${bytes}bytes`
  const KB = parseInt((bytes / 1024) * 10) / 10
  if (KB > 0.8 && KB < 800) return `${KB}KB`
  const MB = parseInt((KB / 1024) * 10) / 10
  if (MB > 0.8 && MB < 800) return `${MB}MB`
  const GB = parseInt((MB / 1024) * 10) / 10
  if (GB > 0.8 && GB < 800) return `${GB}GB`
  const TB = parseInt((GB / 1024) * 10) / 10
  return `${TB}TB`
}
export default {
  props: {
    selected: {
      type: Object,
      default: () => {}
    },
    obj: {
      type: Object,
      default: () => {
        return {
          Key: '',
          key: '',
          LastModified: new Date(),
          Size: 0
        }
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    isSelected() {
      if (this.selected[this.obj.key]) return true
      else return false
    }
  },
  methods: {
    onClick(e) {
      this.$emit('onClick', {
        id: this.obj.key,
        type: 'Object',
        selected: this.selected,
        control: e.ctrlKey,
        shift: e.shiftKey
      })
    },
    filename2Icon(name) {
      return filename2Icon(name)
    },
    bytes2Readable(bytes) {
      return bytes2Readable(bytes)
    },
    onDBClick(e) {
      window.open(`/dir/gimg/${this.obj.Key}`, '_blank')
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
