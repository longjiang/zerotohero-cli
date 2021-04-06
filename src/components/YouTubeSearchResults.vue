<template>
  <div>
    <YouTubeVideoList :videos="videos" :checkSubs="true" :updateVideos="updateVideos" />
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
      let videos = await YouTube.searchByGoogle(
        {
          term: this.term,
          start: this.start || 0,
          lang: this.$l2.code,
          captions: true
        }
      )
      this.videos = videos.map(video => {
        video.youtube_id = video.id
        video.id = undefined
        return video
      })
      this.updateVideos++
    },
  }

}
</script>