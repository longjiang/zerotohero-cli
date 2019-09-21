<template>
  <div class="youtube-browse container mt-5 mb-5 main">
    <div class="row">
      <div class="col-sm-12">
        <h1 v-if="title" class="mb-5 text-center">
          <Annotate>
            <span>{{ title }}</span>
          </Annotate>
        </h1>
        <h4 class="text-center mt-5">{{ $t('Videos') }}</h4>
        <hr class="mb-5" />
        <YouTubeVideoList :videos="videos" />
        <h4 class="text-center mt-5">{{ $t('Playlists') }}</h4>
        <hr />
        <p class="text-center mb-5">
          <b>{{ $t('Note:') }}</b> {{ $t('Videos in playlists may not have subtitles.') }}
        </p>
        <YouTubePlaylists :playlists="playlists" />
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeVideoList from '@/components/YouTubeVideoList'
import YouTubePlaylists from '@/components/YouTubePlaylists'
import YouTube from '@/lib/youtube'
export default {
  components: {
    YouTubeVideoList,
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
      playlists: [],
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
      YouTube.channel(
        this.args,
        channel => {
          this.title = channel.title
          this.videos = channel.videos.filter(video => video.cc)
        },
        3600
      )
      YouTube.channelPlaylists(
        this.args,
        playlists => {
          if (playlists) {
            this.playlists = playlists.sort((a, b) =>
              a.title < b.title ? -1 : 1
            )
          }
        },
        3600
      )
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
