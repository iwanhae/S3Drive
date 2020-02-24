<template>
  <div
    style="width:100%;height:100%"
    @click.self="clearSelected"
    @dragenter="onDragEnter"
    @dragover="onDragover"
    @drop="onDrop"
  >
    <div class="breadcrumb" @click.self="clearSelected">
      <i
        :class="{
          'el-icon-refresh-left': true,
          refresh: true,
          rotate: onLoad
        }"
        @click="refresh()"
      ></i>
      <el-breadcrumb separator="/" style="margin: auto 10px;font-size: 18px;">
        <el-breadcrumb-item>
          <nuxt-link to="/files">{{ $store.state.auth.id }}</nuxt-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="p in pathArray" :key="p.link">
          <nuxt-link :to="p.link" style="font-weight:400;cursor:pointer;">{{
            p.name
          }}</nuxt-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group v-if="showNextPage">
        <el-button icon="el-icon-house" circle @click="$router.push('?')">
        </el-button>
        <el-button
          icon="el-icon-arrow-right"
          circle
          @click="$router.push(`?token=${nextToken}`)"
        >
        </el-button>
      </el-button-group>
    </div>
    <div>
      <div class="container" @click.self="clearSelected">
        <Bucket
          v-for="b in bucket"
          :key="b.Name"
          :bucket="b"
          :selected="selected"
          @onClick="onBucketSelected"
        >
        </Bucket>
      </div>
      <div class="container" @click.self="clearSelected">
        <Directory
          v-for="d in dir"
          :key="d"
          draggable="true"
          :selected="selected"
          :name="d"
          @onClick="onDirectorySelected"
        >
        </Directory>
      </div>
      <div class="container" @click.self="clearSelected">
        <Obj
          v-for="o in obj"
          :key="o.Key"
          :obj="o"
          :selected="selected"
          @onClick="onDirectorySelected"
        >
        </Obj>
      </div>
      <div v-if="onLoad" class="container" style="margin:50px;">
        <div style="margin: auto;">
          <span>Loading.....</span>
          <i class="el-icon-refresh-left refresh rotate"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bucket from '~/components/items/Bucket.vue'
import Directory from '~/components/items/Directory.vue'
import Obj from '~/components/items/Object.vue'
const { handleDrop, blockDefaulBehavior } = require('~/lib/DragnDrop.ts')

export default {
  components: { Bucket, Directory, Obj },
  props: {
    path: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      bucket: [],
      dir: [],
      obj: [],
      selected: {},
      lastSelected: '',
      onLoad: false,
      moreContent: true,
      nextToken: '',
      showNextPage: false
    }
  },
  computed: {
    pathArray() {
      const output = []
      let link = '/files/'
      this.path.split('/').forEach((e) => {
        if (e !== '') {
          link += e + '/'
          output.push({
            name: e,
            link: link.trim()
          })
        }
      })
      return output
    }
  },
  watch: {
    path() {
      this.refresh()
    },
    $route(to, from) {
      if (to.query.token) this.refresh(to.query.token)
      else this.refresh()
    }
  },
  mounted() {
    // console.log(DragnDrop)
    const { token } = this.$route.query
    this.refresh(token)
  },
  methods: {
    onDragEnter(e) {
      blockDefaulBehavior(e)
    },
    async onDrop(e) {
      blockDefaulBehavior(e)
      console.log(await handleDrop(e))
    },
    onDragover(e) {
      blockDefaulBehavior(e)
    },
    clearSelected(e) {
      for (const key in this.selected) this.selected[key] = false
      this.selected = { ...this.selected }
    },
    onDirectorySelected(e) {
      const tmp = this.selected[e.id]
      if (e.shift) {
        for (const key in this.selected) this.selected[key] = false
        let select = false
        for (const key in this.selected) {
          if (key === this.lastSelected || key === e.id) {
            select = !select
            this.selected[key] = true
          } else {
            this.selected[key] = select
          }
        }
      } else {
        if (!e.control)
          for (const key in this.selected) this.selected[key] = false

        this.selected = Object.assign({ ...this.selected }, { [e.id]: !tmp })
        this.lastSelected = e.id
      }
    },
    onBucketSelected(e) {
      const tmp = this.selected[e.id]
      for (const key in this.selected) this.selected[key] = false
      this.selected = Object.assign({ ...this.selected }, { [e.id]: !tmp })
    },
    async refresh(token = '') {
      try {
        this.onLoad = true
        this.bucket = []
        this.dir = []
        this.obj = []
        this.selected = {}
        this.lastSelected = ''

        const data = await this.$axios.$get(
          `/info/${this.path}` + (token ? `?token=${token}` : '')
        )
        this.nextToken = data.token
        this.bucket = data.bucket
        this.bucket.forEach((b) => (this.selected[b.Name] = false))
        this.dir = data.dir
        this.dir.forEach((d) => (this.selected[d] = false))
        this.obj = data.obj.map((o) =>
          Object.assign(o, { key: o.Key.split('/').slice(-1)[0] })
        )
        this.obj.forEach((o) => (this.selected[o.key] = false))

        this.showNextPage = Object.keys(this.selected).length === 1000
      } catch (err) {
      } finally {
        this.onLoad = false
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-flow: wrap;
}
.refresh {
  font-size: 25px;
  transform: rotate(0deg);
  animation: 1s linear;
  margin: auto 10px;
  cursor: pointer;
}
.breadcrumb {
  display: flex;
  height: 40px;
}
.rotate {
  animation: rotating 1s cubic-bezier(0.5, 0.15, 0.5, 0.85) infinite;
  animation-direction: reverse;
}
</style>
