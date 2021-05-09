<template>
  <div class="youtube-browse container mt-5 mb-5 main">
    <div class="row">
      <div class="col-sm-12">
        <h3 class="text-center">
          Playlist: {{ playlist_id }}
        </h3>
        <div>
          <b-button
            v-if="$settings.adminMode"
            class="btn btn-small mt-2 ml-3"
            @click="addAll()"
            ><i class="fas fa-plus mr-2"></i>Add All</b-button
          >
        </div>
        <YouTubeVideoList :videos="videos" :checkSubs="true" :checkSaved="true" ref="youtubeVideoList" />
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
    addAll() {
      this.$refs.youtubeVideoList.addAll()
    },
    async update() {
      this.title = undefined
      this.videos = []
      let videos = await YouTube.playlistByApi(this.playlist_id)
      if (videos && videos.length > 0) {
        this.videos = await YouTube.checkShows(videos, this.$l2.id)
      }
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
