<template>
  <div class="entry-youtube">
    <div class="widget-title">{{ $t('“{text}” videos on YouTube', {text: text})}}</div>
    <div class="jumbotron-fluid bg-light p-4">
      <YouTubeVideoList :videos="videos" :key="text" />
    </div>
  </div>
</template>

<script>
import YouTube from '@/lib/youtube'
import YouTubeVideoList from '@/components/YouTubeVideoList'

export default {
  components: {
    YouTubeVideoList
  },
  props: {
    text: {
      type: String
    }
  },
  data() {
    return {
      videos: []
    }
  },
  methods: {
    async update() {
      this.videos = []
      let videos = await YouTube.searchByGoogle(
        {
          term: this.text,
          lang: this.$l2.code,
          captions: true
        }
      )
      this.videos = videos
    }
  },
  watch: {
    text() {
      this.update()
    }
  },
  mounted() {
    this.update()
  }
}
</script>

<style></style>
