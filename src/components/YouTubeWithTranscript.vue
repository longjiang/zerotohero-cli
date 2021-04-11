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
        <div style="max-width: calc(50vh * 16 / 9); margin: 0 auto">
          <YouTubeVideo ref="youtube" :youtube="youtube" :starttime="this.l2Lines.length > 0 ? this.l2Lines[startLineIndex].starttime : 0" :autoload="autoload" />  
        </div>
        <div :key="'transcript-' + youtube" class="mt-2">
          <div v-if="this.l2Lines.length > 0" class="text-center">
            <SyncedTranscript
              ref="transcript"
              :onSeek="seekYouTube"
              :onPause="pauseYouTube"
              :lines="this.l2Lines"
              :parallellines="this.l1Lines"
              :single="true"
              :quiz="false"
              :highlight="highlight"
              :startLineIndex="startLineIndex"
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
    },
    highlight: {
      type: String
    },
    autoload: {
      default: false
    },
    startLineIndex: {
      default: 0
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
    getHighlightStartTime(term) {
      let matchedLines = this.l2Lines.filter(line => line.line.includes(term))
      if (matchedLines.length > 0) {
        return matchedLines[0].starttime
      }
    },
    getHighlightLineIndex(term) {
      return this.l2Lines.findIndex(line => line.line.includes(term))
    },
    seekYouTube(starttime) {
      this.$refs.youtube.seek(starttime)
    },
    pauseYouTube() {
      this.$refs.youtube.pause()
    },
    playYouTube() {
      this.$refs.youtube.loadYouTubeiFrame()
    },
    togglePaused() {
      this.$refs.youtube.togglePaused()
    },
  },
  watch: {
    startLineIndex() {
      this.$refs.youtube.seek(this.l2Lines[this.startLineIndex].starttime)
    }
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