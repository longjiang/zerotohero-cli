<template>
  <div>
    <div class="mb-4 text-center" v-if="hits.length > 0">
      <button v-if="hitIndex > 0" @click="prevHit" class="btn btn-default">Previous</button>
      <span class="ml-2 mr-2">{{ hitIndex + 1 }} of {{ hits.length }}</span>
      <button v-if="hitIndex < hits.length - 1" @click="nextHit" class="btn btn-default">Next</button>
      <b-button variant="danger" @click="remove" class="ml-1"
        ><i class="fas fa-trash-alt"></i
      ></b-button>
    </div>
    <div v-if="hits.length > 0" :set="(hit = hits[hitIndex])">
      <YouTubeWithTranscript
        :youtube="hit.video.youtube_id"
        ref="youtube"
        :l2Lines="JSON.parse(hit.video.subs_l2)"
        layout="vertical"
        :highlight="term"
        :startLineIndex="hit.lineIndex"
        :autoload="hitIndex > 0"
      />
    </div>
  </div>
</template>

<script>
import YouTubeWithTranscript from '@/components/YouTubeWithTranscript'
import SyncedTranscript from '@/components/SyncedTranscript'
import SimpleSearch from '@/components/SimpleSearch'
import Config from '@/lib/config'

export default {
  components: {
    SimpleSearch,
    YouTubeWithTranscript,
    SyncedTranscript,
  },
  props: {
    term: {
      type: String,
    },
  },
  data() {
    return {
      videos: [],
      hits: [],
      hitIndex: 0,
    }
  },
  mounted() {
    this.searchSubs(this.term)
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
        this.hits = this.hits.filter(hit => hit.video.id !== id)
      }
    },
    prevHit() {
      this.hitIndex = Math.max(this.hitIndex - 1, 0)
    },
    nextHit() {
      this.hitIndex = Math.min(this.hitIndex + 1, this.hits.length - 1)
    },
    seekYouTube(starttime) {
      this.$refs.youtube.seek(starttime)
    },
    pauseYouTube() {
      this.$refs.youtube.pause()
    },
    async searchSubs(term) {
      let channelFilter = ''
      if (this.$l2.code === 'zh') {
        let approvedChannels = [
          'UCUhpu5MJQ_bjPkXO00jyxsw', // iQiyi
          'UCYQPTeY3HOk0BprrGuCWCaA', // YouKu
          'UCiu3bj4rR8KOYcUA4KNkOAA', // WeTV
          'UCmalSiRq25rjrpycAsS5ocA', // MangoTV
          'UCW22wyIZecX1xgY4BkdRcbQ', // VSO Movie Channel
          'UCLsMbqJe_Oeqm6r9tvP1Nkg', // Clip Box
        ]
        channelFilter = `&filter[channel_id][in]=${approvedChannels.join(',')}`
      }
      let response = await $.getJSON(
        `${Config.wiki}items/youtube_videos?filter[subs_l2][contains]=${this.term}${channelFilter}&filter[l2][eq]=${this.$l2.id}&fields=id,youtube_id,l2,title,level,topic,lesson,subs_l2`
      )
      if (response && response.data && response.data.length > 0) {
        this.videos = response.data
        for (let video of this.videos) {
          let l2Lines = JSON.parse(video.subs_l2)
          for (let index in l2Lines) {
            if (l2Lines[index].line.includes(this.term)) {
              this.hits.push({
                video: video,
                lineIndex: index,
              })
            }
          }
        }
      }
    },
  },
}
</script>
<style lang="scss">
</style>
