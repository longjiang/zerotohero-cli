<template>
  <div class="container-fluid">
    <div v-if="layout === 'horizontal'" class="row">
      <div class="youtube-video-column col-md-6 sticky">
        <div class="youtube-video-wrapper sticky pt-3 pb-3 bg-white" :key="'youtube-' + youtube">
          <YouTubeVideo ref="youtube" :youtube="youtube" />
        </div>
      </div>
      <div class="col-md-6" :key="'transcript-' + youtube">
        <div v-if="this.l2Lines.length > 0">
          <SyncedTranscript
            ref="transcript"
            :onSeek="seekYouTube"
            :onPause="pauseYouTube"
            :lines="this.l2Lines"
            :parallellines="this.l1Lines"
            
          />
        </div>
      </div>
    </div>
    <div v-if="layout === 'vertical'" class="row">
      <div class="col-sm-12">
        <YouTubeVideo ref="youtube" :youtube="youtube" />
        <div :key="'transcript-' + youtube">
          <div v-if="this.l2Lines.length > 0" class="text-center">
            <SyncedTranscript
              ref="transcript"
              :onSeek="seekYouTube"
              :onPause="pauseYouTube"
              :lines="this.l2Lines"
              :parallellines="this.l1Lines"
              :single="true"
              :quiz="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeVideo from '@/components/YouTubeVideo'
import SyncedTranscript from '@/components/SyncedTranscript'

export default {
  props: {
    youtube: {
      type: String
    },
    l1Lines: {
      type: Array
    },
    l2Lines: {
      type: Array
    },
    layout: {
      type: String,
      default: 'horizontal' // or 'vertical'
    }
  },
  data() {
    return {
    }
  },
  components: {
    YouTubeVideo,
    SyncedTranscript
  },
  methods: {
    seekYouTube(starttime) {
      this.$refs.youtube.seek(starttime)
    },
    pauseYouTube() {
      this.$refs.youtube.pause()
    },

    togglePaused() {
      this.$refs.youtube.togglePaused()
    },
  },
  mounted() {
    setInterval(() => {
      if (this.$refs.transcript) {
        this.$refs.transcript.currentTime = this.$refs.youtube
          ? this.$refs.youtube.currentTime()
          : 0
      }
      if (this.$refs.youtube) {
        this.paused = this.$refs.youtube.paused
      }
    }, 1000)
  }

}
</script>

<style>

</style>