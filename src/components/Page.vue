<template>
  <v-runtime-template :template="`<div>${body}</div>`" />
</template>

<script>
import Config from '@/lib/config'
import VRuntimeTemplate from 'v-runtime-template'
import YouTubeVideo from '@/components/YouTubeVideo'
import Sale from '@/components/Sale'

export default {
  components: {
    YouTubeVideo,
    Sale,
    VRuntimeTemplate
  },
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      title: '',
      body: ''
    }
  },
  mounted() {
    if (this.id) {
      this.load(this.id)
    }
  },
  methods: {
    load() {
      $.getJSON(`${Config.wiki}items/pages/${this.id}?`, response => {
        this.title = response.data.title
        this.body = response.data.body
      })
    }
  }
}
</script>

<style>

</style>