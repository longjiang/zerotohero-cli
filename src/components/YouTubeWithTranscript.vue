<template>
  <div class="container-fluid">
    <div class="row">
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
        <div
          v-else
          class="jumbotron pt-4 pb-3 bg-light"
        >
          <h6>
            Sorry, this YouTube video does not have {{ $l2.name }} closed
            captions.
          </h6>
          <p>
            You can tell if a YouTube video has closed captions by clicking on
            the
            <b>CC</b> icon in the player bar, and click on the
            <i class="fas fa-cog"></i>next to it. If you can find the subtitle
            with the language
            <b>{{ $l2.name }}</b>
            then the video has {{ $l2.name }}
            subtitles.
          </p>
          <p>
            To look for videos with t{{ $l2.name }} subtitles, search with a
            {{ $l2.name }}
            keyword, and click
            <b>Filter</b>, then <b>CC</b>.
          </p>
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