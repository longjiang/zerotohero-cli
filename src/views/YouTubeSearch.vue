<template>
  <div class="container pt-5 pb-5 main youtube-search">
    <h1 class="text-center mb-5">Study YouTube Subtitles</h1>
    <SimpleSearch
      :placeholder="$t('Enter a search term in {l2}...', {l2: $l2.name})"
      :action="
        url => {
          location.hash = `/${$l1.code}/${$l2.code}/youtube/search/${encodeURIComponent(url)}/0`
        }
      "
      ref="search"
      class="mb-5"
    />
    <YouTubeSearchResults :term="term" :start="start" />
  </div>
</template>

<script>
import SimpleSearch from '@/components/SimpleSearch'
import YouTubeSearchResults from '@/components/YouTubeSearchResults'

export default {
  components: {
    SimpleSearch,
    YouTubeSearchResults
  },
  props: {
    term: {
      type: String
    },
    start: {
      default: 0
    }
  },
  data() {
    return {
      location,
    }
  },
  watch: {
    term() {
      this.updateSearchText()
    }
  },
  mounted() {
    this.updateSearchText()
  },
  methods: {
    async updateSearchText() {
      let url = decodeURIComponent(this.term)
      this.$refs.search.text = url
    }
  }
}
</script>

<style>
</style>
