<template>
  <div class="youtube-browse container mt-5 mb-5 main">
    <div class="row">
      <div class="col-sm-12">
        <div v-if="avatar" class="text-center mb-3">
          <img :src="avatar" class="avatar" alt />
        </div>
        <h1 v-if="title" class="mb-4 text-center">
          <Annotate>
            <span>{{ title }}</span>
          </Annotate>
        </h1>
        <template v-if="!loading">
          <div class="text-center">
            <button class="btn btn-default" v-if="!saved" @click="save">Save channel</button>
            <div class="btn btn-default" v-if="saved"><i class="fa fa-check mr-2"></i>Saved</div>
          </div>
          <h4 class="text-center mt-5">{{ $t('Videos') }}</h4>
          <hr class="mb-5" />
          <YouTubeVideoList :videos="videos" />
          <h4 class="text-center mt-5">{{ $t('Playlists') }}</h4>
          <hr />
          <p class="text-center mb-5">
            <b>{{ $t('Note:') }}</b> {{ $t('Videos in playlists may not have subtitles.') }}
          </p>
          <YouTubePlaylists :playlists="playlists" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeVideoList from '@/components/YouTubeVideoList'
import YouTubePlaylists from '@/components/YouTubePlaylists'
import YouTube from '@/lib/youtube'
import Config from '@/lib/config'

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
      videos: [],
      avatar: undefined,
      loading: true,
      saved: false
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    async getSaved() {
      this.saved = false
      let response = (await $.getJSON(
        `${Config.wiki}items/youtube_channels?filter[channel_id][eq]=${this.args}`
      )).data
      if (response) {
        this.saved = response
      }
    },
    async save() {
      let file = await $.post(`${Config.wiki}files`, {
        data: this.avatar
      })
      let success = await $.post(`${Config.wiki}items/youtube_channels`, {
        channel_id: this.args,
        name: this.title,
        language: this.$l2.id,
        avatar: file.data.id
      })
      if (success) {
        this.saved = success.data
      }
    },
    update() {
      this.title = undefined
      this.avatar = undefined
      this.videos = []
      this.getSaved()
      YouTube.channel(
        this.args,
        channel => {
          this.title = channel.title
          this.videos = channel.videos.filter(video => video.cc)
          this.avatar = channel.avatar
          this.loading = false
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

<style>

.avatar {
  border-radius: 100%;
  height: 4rem;
}
</style>
