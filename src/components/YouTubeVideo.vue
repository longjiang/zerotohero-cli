<template>
  <div class="youtube" :key="youtube">
    <div
      v-bind:style="{
        backgroundImage:
          'url(' + '//img.youtube.com/vi/' + youtube + '/hqdefault.jpg' + ')'
      }"
      class="youtube-screen"
      v-on:click="loadYouTubeiFrame()"
    >
      <div :id="youtubeIframeID"></div>
    </div>
  </div>
</template>

<script>
import Helper from '@/lib/helper'

export default {
  data() {
    return {
      youtubeIframeID: 'youtube-' + Helper.uniqueId(),
      time: this.starttime,
      player: undefined
    }
  },
  props: {
    youtube: {
      type: String
    },
    starttime: {
      default: 0
    }
  },
  mounted() {
    // eslint-disable-next-line no-unused-vars
    window.onYouTubePlayerAPIReady = function() {
      // This needs to be in global scope as YouTube api will call it
      // This function is overwridden from the app.loadYouTubeiFrame() function
    }

    // eslint-disable-next-line no-unused-vars
    window.onPlayerReady = function(evt) {
      // Required by YouTube API
    }
  },
  methods: {
    currentTime() {
      return this.player && this.player.getCurrentTime
        ? this.player.getCurrentTime()
        : 0
    },
    loadYouTubeiFrame() {
      let that = this
      // $('.youtube iframe').remove();
      this.removeYouTubeAPIVars()
      window.onYouTubePlayerAPIReady = () => {
        // eslint-disable-next-line no-undef
        that.player = new YT.Player(this.youtubeIframeID, {
          height: '390',
          width: '640',
          videoId: this.youtube,
          playerVars: {
            start: parseInt(this.starttime),
            autoplay: 1,
            controls: 1,
            showinfo: 0,
            playsinline: 1,
            rel: 0
          },
          onReady() {}
        })
      }
      $.getScript('//www.youtube.com/iframe_api')
    },
    removeYouTubeAPIVars() {
      if (window['YT']) {
        let vars = [
          'YT',
          'YTConfig',
          'onYTReady',
          'yt',
          'ytDomDomGetNextId',
          'ytEventsEventsListeners',
          'ytEventsEventsCounter'
        ]
        vars.forEach(function(key) {
          window[key] = undefined
        })
      }
    },
    seek(starttime) {
      if (this.player) {
        this.player.seekTo(starttime)
      }
    }
  }
}
</script>

<style>
.youtube {
  padding-bottom: 56.25%;
  position: relative;
}

.youtube iframe,
.youtube-screen {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.youtube-screen {
  background-size: cover;
  background-position: center;
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.youtube-screen::after {
  content: '';
  background: url('/img/youtube-red.svg');
  width: 100px;
  height: 100px;
}
</style>
