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
    update() {
      this.videos = []
      YouTube.search(
        this.text,
        videos => {
          this.videos = videos.filter(video => video.cc)
        },
        {
          subs: true,
          lang: 'en'
        }
      )
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
