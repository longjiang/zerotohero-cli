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
    }
  },
  mounted() {
    this.searchSubs(this.terms[0])
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
          'UCU5qmd5NvJljDBeM1sD-D1A', // Q1Q2
          'UC7ACqIQiy1SkjglQQ6bWDRg', // 捷成华视 Idol & Romance
          'UCKn4SloJmZYNYNq6RgzgrHw', // NewTV
          'UCPh1aKtroMioOCPHTGPwUBQ', // Classic
          'UChqXUTNBOnIaBEU7K6Le6FA', // 邓小平
          'UCShvs7P4CMTGzHTmEwZRcHQ', // 茶馆
          'UCIZwFGOBwV1wOvCaRMIgNRQ', // 地道战
          'UCEWBSXNFMVBc7p79dtIh3HA', // 刘罗锅
          'UC8a4CRn6S5Yq2wEJ07B70OA', // 刘罗锅
          'UC7Vl0YiY0rDlovqcCFN4yTA', // CCTV 电视剧
          'UCdpiId0eJGnnIvfhpbJIM1w', // 腾讯动漫
          'UC2B9maQhihZed6ovrnK1cBA', // MZTV Exclusive Chinese Drama
          'UCNORTw_uosRNGgdEjwdHvuw', // 大劇獨播MZTV
          'UC0jYsshDZfOBZC9nIJn94Cg', // China Zone
          'UCteBLoijWzlVFSR5BBtS_2Q', // 优优独播剧场 YoYo Television Series Exclusive
          'UCLsrDKheyHv7GYsTkMaw2bw', // 优优青春剧场 YoYo fun station
          'UC5-YbNL-MUy1_tC9KSkEShw', // Caravan中文剧场
          'UCPIRD4yr1hlAEovBCSNlAKg', // Croton MEGA HIT
          'UC7VY0GWLswq_Z48nkETL-yA', // Chinese Drama
        ]
        channelFilter = `&filter[channel_id][in]=${approvedChannels.join(',')}`
      }
      let videos = []
      console.log(this.terms)
      for (let term of this.terms) {
        let response = await $.getJSON(
          `${Config.wiki}items/youtube_videos?filter[subs_l2][contains]=${term}${channelFilter}&filter[l2][eq]=${this.$l2.id}&fields=id,youtube_id,l2,title,level,topic,lesson,subs_l2&timestamp=${this.$settings.adminMode ? Date.now() : 0}`
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
      this.checking = false
    },
  },
}
</script>
<style lang="scss">
</style>
