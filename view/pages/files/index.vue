<template>
  <Directory />
</template>
<script>
import Directory from '~/components/Directory.vue'
export default {
  components: {
    Directory
  },
  middleware: 'auth'
}
</script>
