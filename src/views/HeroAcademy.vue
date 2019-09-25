<template>
  <div class="youtube-browse container mt-5 mb-5 main">
    <div class="row">
      <div class="col-sm-12">
        <h1 class="mb-5 text-center">Hero Academy</h1>
        <h4 class="text-center mt-5">Subjects</h4>
        <hr />
        <p class="text-center mb-5">
          Subjects arranged by the Dewey decimal system (like the call numbers
          on library books).
        </p>
        <YouTubePlaylists :playlists="playlists" />
      </div>
    </div>
  </div>
</template>

<script>
import YouTubePlaylists from '@/components/YouTubePlaylists'
import YouTube from '@/lib/youtube'
export default {
  components: {
    YouTubePlaylists
  },
  props: {
    args: {
      type: String
    }
  },
  data() {
    return {
      title: undefined,
      channelId: 'UCMoxI3OhLuyItB8__6iuJhg',
      playlists: [],
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
      YouTube.channel(
        this.args,
        channel => {
          this.title = channel.title
          this.videos = channel.videos
        },
        3600
      )
      let playlists = await YouTube.channelPlayListsByAPI(this.channelId, 3600)
      if (playlists) {
        this.playlists = playlists.sort((a, b) => (a.title < b.title ? -1 : 1))
      }
    }
  },
  watch: {
    args() {
      if (this.$route.name === 'youtube-channel') {
        this.update()
      }
    }
  }
}
</script>

<style></style>
