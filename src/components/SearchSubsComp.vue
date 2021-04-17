<template>
  <div>
    <div class="text-center" v-if="checking">Checking content...</div>
    <div class="text-center" v-if="!checking && hits.length === 0">
      No hits.
    </div>
    <div class="mb-1 text-center" v-if="hits.length > 0">
      <b-button @click="previousLine" class="btn btn-small"
        ><i class="fa fa-backward"
      /></b-button>
      <b-button @click="rewind" class="btn btn-small"
        ><i class="fa fa-undo"
      /></b-button>
      <b-button @click="nextLine" class="btn btn-small"
        ><i class="fa fa-forward"
      /></b-button>
      <button
        :disabled="hitIndex === 0"
        @click="prevHit"
        :class="{ btn: true, 'btn-small': true, invisible: hitIndex === 0 }"
        :data-bg-level="level"
      >
        <i class="fa fa-chevron-left" />
      </button>
      <span class="ml-2 btn-small mr-2" style="background: none"
        >{{ hitIndex + 1 }} of {{ hits.length }}</span
      >
      <button
        :disabled="hitIndex >= hits.length - 1"
        @click="nextHit"
        :data-bg-level="level"
        :class="{
          btn: true,
          'btn-small': true,
          invisible: hitIndex >= hits.length - 1,
        }"
      >
        <i class="fa fa-chevron-right" />
      </button>
      <router-link
        :to="`/${$l1.code}/${$l2.code}/youtube/view/${hits[hitIndex].video.youtube_id}/`"
        class="btn btn-small"
        ><i class="fa fa-window-maximize mr-2" />Open Full</router-link
      >
    </div>
    <div v-if="hits.length > 0" :set="(hit = hits[hitIndex])">
      <YouTubeWithTranscript
        :youtube="hit.video.youtube_id"
        ref="youtube"
        :l2Lines="hit.video.subs_l2"
        layout="vertical"
        :highlight="terms"
        :startLineIndex="Math.max(hit.lineIndex - 1, 0)"
        :stopLineIndex="Number(hit.lineIndex)"
        :autoload="Helper.iOS() || navigated"
        :autoplay="navigated"
      />
    </div>
  </div>
</template>

<script>
import YouTubeWithTranscript from '@/components/YouTubeWithTranscript'
import SyncedTranscript from '@/components/SyncedTranscript'
import SimpleSearch from '@/components/SimpleSearch'
import Config from '@/lib/config'
import shuffle from 'shuffle-array'
import Helper from '@/lib/helper'

export default {
  components: {
    SimpleSearch,
    YouTubeWithTranscript,
    SyncedTranscript,
  },
  props: {
    terms: {
      type: Array,
    },
    level: {
      type: String,
    },
  },
  data() {
    return {
      hits: [],
      hitIndex: 0,
      navigated: false,
      checking: true,
      videos: [],
      Helper
    }
  },
  mounted() {
    this.searchSubs()
  },
  activated() {
    setTimeout(() => {
      this.$refs.youtube.pause()
    }, 800)
  },
  methods: {
    previousLine() {
      this.$refs.youtube.previousLine()
    },
    nextLine() {
      this.$refs.youtube.nextLine()
    },
    rewind() {
      this.$refs.youtube.rewind()
    },
    async remove() {
      let id = this.hits[this.hitIndex].video.id
      let response = await $.ajax({
        url: `${Config.wiki}items/youtube_videos/${id}`,
        type: 'DELETE',
        contentType: 'application/json',
        xhr: function () {
          return window.XMLHttpRequest == null ||
            new window.XMLHttpRequest().addEventListener == null
            ? new window.ActiveXObject('Microsoft.XMLHTTP')
            : $.ajaxSettings.xhr()
        },
      })
      if (response) {
        this.hits = this.hits.filter((hit) => hit.video.id !== id)
      }
    },
    prevHit() {
      this.hitIndex = Math.max(this.hitIndex - 1, 0)
      this.navigated = true
    },
    nextHit() {
      this.hitIndex = Math.min(this.hitIndex + 1, this.hits.length - 1)
      this.navigated = true
    },
    seekYouTube(starttime) {
      this.$refs.youtube.seek(starttime)
    },
    pauseYouTube() {
      this.$refs.youtube.pause()
    },
    async searchSubs() {
      this.hits = []
      this.videos = []
      this.checking = true
      let channelFilter = ''
      let approvedChannels = Config.approvedChannels[this.$l2.code]
      if (approvedChannels) {
        channelFilter = `&filter[channel_id][in]=${approvedChannels.join(',')}`
      }
      for (let term of this.terms) {
        let response = await $.getJSON(
          `${Config.wiki}items/youtube_videos?filter[subs_l2][contains]=${term}${channelFilter}&filter[l2][eq]=${this.$l2.id}&fields=id,youtube_id,l2,title,level,topic,lesson,subs_l2&timestamp=${this.$settings.adminMode ? Date.now() : 0}`
        )
        if (response && response.data && response.data.length > 0) {
          this.videos = this.videos.concat(response.data)
        }
      }
      let seenYouTubeIds = []
      for (let video of shuffle(this.videos)) {
        if (!seenYouTubeIds.includes(video.youtube_id)) {
          seenYouTubeIds.push(video.youtube_id)
          video.subs_l2 = JSON.parse(video.subs_l2)
          for (let index in video.subs_l2) {
            if (
              new RegExp(this.terms.join('|')).test(video.subs_l2[index].line)
            ) {
              this.hits.push({
                video: video,
                lineIndex: index,
              })
            }
          }
        }
      }
      this.$emit('loaded', this.hits)
      this.checking = false
    },
  },
}
</script>
<style lang="scss">
</style>
