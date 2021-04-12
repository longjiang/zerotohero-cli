<template>
  <div class="youtube-videos">
    <YouTubeVideoCard
      v-for="(video, videoIndex) in videos"
      :video="video"
      :checkSaved="checkSaved"
      :checkSubs="checkSubs"
    />
  </div>
</template>

<script>
import Helper from '@/lib/helper'
import Config from '@/lib/config'
import YouTubeVideoCard from '@/components/YouTubeVideoCard'

export default {
  components: {
    YouTubeVideoCard,
  },
  data() {
    return {
      Helper,
      videosInfoKey: 0,
    }
  },
  props: {
    videos: {
      type: Array,
    },
    checkSaved: {
      default: false,
    },
    checkSubs: {
      default: false,
    }
  }
}
</script>

<style lang="scss">
.youtube-videos {
  display: flex;
  flex-wrap: wrap;
}
</style>
