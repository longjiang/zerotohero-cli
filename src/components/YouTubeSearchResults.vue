<template>
  <div>
    <YouTubeVideoList ref="youTubeVideoList" :videos="videos" :checkSubs="true" :updateVideos="updateVideos" :checkSaved="true" />
    <div class="mt-4 text-center">
      <router-link v-if="start > 9" :to="`/${$l1.code}/${$l2.code}/youtube/search/${encodeURIComponent(term)}/${Number(start) - 10}`" class="btn btn-default mr-2">Previous</router-link>
      <router-link :to="`/${$l1.code}/${$l2.code}/youtube/search/${encodeURIComponent(term)}/${Number(start) + 10}`" class="btn btn-default">Next</router-link>
    </div>
  </div>
</template>

<script>
import Helper from '@/lib/helper'
import YouTube from '@/lib/youtube'
import YouTubeVideoList from '@/components/YouTubeVideoList'

export default {
  components: {
    YouTubeVideoList
  },
  props: {
    term: {
      type: String
    },
    start: {
      default: 0
    },
    captions: {
      type: String,
      default: 'all' // or 'nocaptions' or 'all'
    },
    checkSubs: {
      default: false
    }
  },
  data() {
    return {
      videos: [],
      updateVideos: 0
    }
  },
  mounted() {
    this.updateURL()
  },
  watch: {
    term() {
      this.updateURL()
    },
    start() {
      this.updateURL()
    }
  },
  methods: {
    async updateURL() {
      this.videos = []
      let options = {
        term: this.term,
        start: this.start || 0,
        lang: this.$l2.code,
      }
      if (this.captions === 'nocaptions') options.captions = false
      if (this.captions === 'captions') options.captions = true
      let videos = await YouTube.searchByGoogle(options)
      this.videos = videos.map(video => {
        video.youtube_id = video.id
        video.id = undefined
        return video
      })
      this.updateVideos++
    },
    addAll() {
      this.$refs.youTubeVideoList.addAll()
    }
  }
}
</script>