<template>
  <div>
    <div class="text-center" v-if="checking">Checking content...</div>
    <div class="text-center" v-if="!checking && hits.length === 0">
      No hits.
    </div>
    <div class="mb-4 text-center" v-if="hits.length > 0">
      <button v-if="hitIndex > 0" @click="prevHit" class="btn btn-default">
        Previous
      </button>
      <span class="ml-2 mr-2">{{ hitIndex + 1 }} of {{ hits.length }}</span>
      <button
        v-if="hitIndex < hits.length - 1"
        @click="nextHit"
        class="btn btn-default"
      >
        Next
      </button>
    </div>
    <div v-if="hits.length > 0" :set="(hit = hits[hitIndex])">
      <YouTubeWithTranscript
        :youtube="hit.video.youtube_id"
        ref="youtube"
        :l2Lines="hit.video.subs_l2"
        layout="vertical"
        :highlight="terms"
        :startLineIndex="hit.lineIndex"
        :autoload="true"
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
  },
  data() {
    return {
      hits: [],
      hitIndex: 0,
      navigated: false,
      checking: true,
    }
  },
  mounted() {
    this.searchSubs(this.terms[0])
  },
  methods: {
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
      this.checking = true
      let channelFilter = ''
      if (this.$l2.code === 'zh') {
        let approvedChannels = [
          'UCUhpu5MJQ_bjPkXO00jyxsw', // iQiyi
          'UCYQPTeY3HOk0BprrGuCWCaA', // YouKu
          'UCiu3bj4rR8KOYcUA4KNkOAA', // WeTV
          'UCQatgKoA7lylp_UzvsLCgcw', // Tencent Video
          'UCmalSiRq25rjrpycAsS5ocA', // MangoTV
          'UCTulSfEm1c14WWRbSN-CNAQ', // MGTV Drama
          'UCW22wyIZecX1xgY4BkdRcbQ', // VSO Movie Channel
          'UCLsMbqJe_Oeqm6r9tvP1Nkg', // Clip Box
          'UCcLK3j-XWdGBnt5bR9NJHaQ', // CCTV
          'UCjnJ4buqbnpRVaT3IDUQPZQ', // CCTV chun wan
          'UCLsrDKheyHv7GYsTkMaw2bw', // YoYo fun station
          'UCU5qmd5NvJljDBeM1sD-D1A', // Q1Q2
          'UC7ACqIQiy1SkjglQQ6bWDRg', // Idol & Romance
          'UCKn4SloJmZYNYNq6RgzgrHw', // NewTV
        ]
        channelFilter = `&filter[channel_id][in]=${approvedChannels.join(',')}`
      }
      let videos = []
      for (let term of this.terms) {
        let response = await $.getJSON(
          `${
            Config.wiki
          }items/youtube_videos?filter[subs_l2][contains]=${term}${channelFilter}&filter[l2][eq]=${
            this.$l2.id
          }&fields=id,youtube_id,l2,title,level,topic,lesson,subs_l2`
        )
        if (response && response.data && response.data.length > 0) {
          videos = videos.concat(response.data)
        }
      }
      let seenYouTubeIds = []
      for (let video of shuffle(videos)) {
        if (!seenYouTubeIds.includes(video.youtube_id)) {
          seenYouTubeIds.push(video.youtube_id)
          video.subs_l2 = JSON.parse(video.subs_l2)
          for (let index in video.subs_l2) {
            if (new RegExp(this.terms.join('|')).test(video.subs_l2[index].line)) {
              this.hits.push({
                video: video,
                lineIndex: index,
              })
            }
          }
        }
      }
      this.checking = false
    },
  },
}
</script>
<style lang="scss">
</style>
