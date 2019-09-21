<template>
  <div class="container pt-5 pb-5 main">
    <h1 class="text-center mb-5">Study YouTube Subtitles</h1>
    <SimpleSearch
      :placeholder="`Enter a search term in English...`"
      :action="
        url => {
          location.hash = `#/${$lang.code}/youtube/search/${encodeURIComponent(url)}`
        }
      "
      ref="search"
      class="mb-5"
    />
    <YouTubeVideoList :videos="videos" />
  </div>
</template>

<script>
import YouTube from '@/lib/youtube'
import YouTubeVideoList from '@/components/YouTubeVideoList'
import SimpleSearch from '@/components/SimpleSearch'

export default {
  components: {
    YouTubeVideoList,
    SimpleSearch
  },
  props: {
    args: {
      type: String
    }
  },
  data() {
    return {
      location,
      videos: []
    }
  },
  watch: {
    args() {
      this.updateURL()
    }
  },
  mounted() {
    this.updateURL()
  },
  methods: {
    async updateURL() {
      let url = decodeURIComponent(this.args)
      this.$refs.search.text = url
      YouTube.search(
        this.args,
        videos => {
          this.videos = videos.filter(video => video.cc)
        },
        { subs: true, lang: 'en' }
      )
    }
  }
}
</script>

<style></style>
