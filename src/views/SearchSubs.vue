<template>
  <div class="main pt-3 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <SimpleSearch
            class="mb-5"
            :placeholder="`Search across ${$l2.name} YouTube subtitles`"
            buttonText="Search"
            :action="
              url => {
                this.$router.push({path: `/${$l1.code}/${
                  $l2.code
                }/youtube/search-subs/${encodeURIComponent(url)}`})
              }
            "
            ref="search"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <div v-for="video in results.slice(0, 1)">
            <h4>{{ video.title }}</h4>
            <YouTubeWithTranscript
              :youtube="video.youtube_id"
              ref="youtube"
              :l2Lines="JSON.parse(video.subs_l2)"
              layout="vertical"
              :highlight="term"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeWithTranscript from '@/components/YouTubeWithTranscript'
import SyncedTranscript from '@/components/SyncedTranscript'
import YouTubeChannelCard from '@/components/YouTubeChannelCard'
import SimpleSearch from '@/components/SimpleSearch'
import YouTubeSearchResults from '@/components/YouTubeSearchResults'
import YouTube from '@/lib/youtube'
import Helper from '@/lib/helper'
import Config from '@/lib/config'

export default {
  components: {
    YouTubeSearchResults,
    SimpleSearch,
    YouTubeWithTranscript,
    YouTubeChannelCard,
    SyncedTranscript,
  },
  props: {
    term: {
      type: String,
    },
    lesson: {
      default: false,
    },
  },
  data() {
    return {
      results: []
    }
  },
  watch: {
    term() {
      this.updateSearchText()
    },
  },
  mounted() {
    this.updateSearchText()
    console.log(this.$refs.search.text)
  },
  methods: {
    seekYouTube(starttime) {
      this.$refs.youtube.seek(starttime)
    },
    pauseYouTube() {
      this.$refs.youtube.pause()
    },
    updateSearchText() {
      let termDecoded = decodeURIComponent(this.term)
      this.searchSubs(this.term)
    },
    async searchSubs(term) {
      let response = await $.getJSON(
        `${Config.wiki}items/youtube_videos?filter[subs_l2][contains]=${this.term}&filter[l2][eq]=${this.$l2.id}&fields=id,youtube_id,l2,title,level,topic,lesson,subs_l2`
      )
      if (response && response.data && response.data.length > 0) {
        this.results = response.data
      }
    },
  }
}
</script>
<style lang="scss">
</style>
