<template>
  <div class="container-fluid">
    <div v-if="layout === 'horizontal'" class="row">
      <div class="youtube-video-column col-md-6 sticky">
        <div class="youtube-video-wrapper sticky pt-3 pb-3 bg-white" :key="'youtube-' + youtube">
          <YouTubeVideo ref="youtube" :youtube="youtube"/>
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
    <template v-if="layout === 'vertical'">
      <div  class="row video-area">
        <div class="col-sm-12">
          <div class="youtube-video-wrapper">
            <YouTubeVideo ref="youtube" :youtube="youtube" :starttime="this.l2Lines.length > 0 ? this.l2Lines[startLineIndex].starttime : 0" :autoload="autoload" :autoplay="autoplay" />  
          </div>
        </div>
      </div>
      <div class="row">
        <div :key="'transcript-' + youtube" class="mt-2 col-sm-12">
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
              :highlight-saved-words="false"
              :startLineIndex="startLineIndex"
              :stopLineIndex="stopLineIndex"
            />
          </div>
        </div>
      </div>
    </template>
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
      type: Array
    },
    autoload: {
      default: false
    },
    autoplay: {
      default: false
    },
    startLineIndex: {
      default: 0
    },
    stopLineIndex: {
      default: -1
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
    previousLine() {
      this.$refs.transcript.previousLine()
    },
    nextLine() {
      this.$refs.transcript.nextLine()
    },
    rewind() {
      this.seekYouTube(this.l2Lines[this.startLineIndex].starttime)
    },
    pause() {
      this.$refs.youtube.pause()
    },
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
      this.rewind()
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
    }, 100)
  }

}
</script>

<style scoped>
.youtube-video-wrapper {
  max-width: calc((100vh - 10rem) * 16 / 9);
  margin: 0 auto;
}
</style>