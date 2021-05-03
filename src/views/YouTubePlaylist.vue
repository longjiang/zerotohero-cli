<template>
  <div class="youtube-browse container mt-5 mb-5 main">
    <div class="row">
      <div class="col-sm-12">
        <h3 class="text-center">
          Playlist: {{ playlist_id }}
        </h3>
        <YouTubeVideoList :videos="videos" :checkSubs="true" :checkSaved="true" />
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeNav from '@/components/YouTubeNav'
import YouTubeVideoList from '@/components/YouTubeVideoList'
import YouTube from '@/lib/youtube'
export default {
  components: {
    YouTubeNav,
    YouTubeVideoList
  },
  props: {
    playlist_id: {
      type: String
    }
  },
  data() {
    return {
      title: undefined,
      videos: []
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    async update() {
      this.title = undefined
      this.videos = []
      this.videos = await YouTube.playlistByApi(this.playlist_id)
    }
  },
  watch: {
    playlist_id() {
      if (this.$route.name === 'youtube-playlist') {
        this.update()
      }
    }
  }
}
</script>
