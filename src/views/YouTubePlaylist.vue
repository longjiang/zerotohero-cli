<template>
  <div class="youtube-browse container mt-5 mb-5 main">
    <div class="row">
      <div class="col-sm-12">
        <h3 v-if="title" class="text-center">
          Playlist: <Annotate><span>{{ title }}</span></Annotate>
        </h3>
        <hr />
        <p class="text-center mb-5">
          <b>Note:</b> Videos may not have subtitles.
        </p>
        <YouTubeVideoList :videos="videos" />
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
    args: {
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
    update() {
      this.title = undefined
      this.videos = []
      YouTube.playlist(
        this.args,
        playlist => {
          this.title = playlist.title
          this.videos = playlist.videos
        },
        3600
      )
    }
  },
  watch: {
    args() {
      if (this.$route.name === 'youtube-playlist') {
        this.update()
      }
    }
  }
}
</script>
