<template>
  <div class="container pt-5 pb-5 main">
    <h1 class="text-center mb-5">Study YouTube Subtitles</h1>
    <SimpleSearch
      :placeholder="$t('Enter a search term in {l2}...', {l2: $l2.name})"
      :action="
        url => {
          location.hash = `#/${$l1.code}/${$l2.code}/youtube/search/${encodeURIComponent(url)}/0`
        }
      "
      ref="search"
      class="mb-5"
    />
    <YouTubeVideoList :videos="videos" />
    <div class="mt-4 text-center">
      <a v-if="start > 9" :href="`#/${$l1.code}/${$l2.code}/youtube/search/${encodeURIComponent(term)}/${Number(start) - 10}`" class="btn btn-default mr-2">Previous</a>
      <a :href="`#/${$l1.code}/${$l2.code}/youtube/search/${encodeURIComponent(term)}/${Number(start) + 10}`" class="btn btn-default">Next</a>
    </div>
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
    term: {
      type: String
    },
    start: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      location,
      videos: []
    }
  },
  watch: {
    term() {
      this.updateURL()
    },
    start() {
      this.updateURL()
    }
  },
  mounted() {
    this.updateURL()
  },
  methods: {
    async updateURL() {
      this.videos = []
      let url = decodeURIComponent(this.term)
      this.$refs.search.text = url
      let videos = await YouTube.searchByGoogle(
        {
          term: this.term,
          start: this.start || 0,
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
