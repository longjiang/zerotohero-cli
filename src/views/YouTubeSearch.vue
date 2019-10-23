<template>
  <div class="container pt-5 pb-5 main">
    <h1 class="text-center mb-5">Study YouTube Subtitles</h1>
    <SimpleSearch
      :placeholder="$t('Enter a search term in {l2}...', {l2: $l2.name})"
      :action="
        url => {
          location.hash = `#/${$l1.code}/${$l2.code}/youtube/search/${encodeURIComponent(url)}`
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
      this.videos = []
      let url = decodeURIComponent(this.args)
      this.$refs.search.text = url
      let videos = await YouTube.searchByGoogle(
        {
          term: this.args,
          lang: this.$l2.code,
          captions: true
        }
      )
      this.videos = videos
    }
  }
}
</script>

<style></style>
