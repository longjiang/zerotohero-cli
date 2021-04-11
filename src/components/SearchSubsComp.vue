<template>
  <div>
    <div class="mb-4 text-center" v-if="hits.length > 0">
      <button v-if="hitIndex > 0" @click="prevHit" class="btn btn-default">Previous</button>
      <span class="ml-2 mr-2">{{ hitIndex + 1 }} of {{ hits.length }}</span>
      <button v-if="hitIndex < hits.length - 1" @click="nextHit" class="btn btn-default">Next</button>
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
      let response = await $.getJSON(
        `${Config.wiki}items/youtube_videos?filter[subs_l2][contains]=${this.term}&filter[l2][eq]=${this.$l2.id}&fields=id,youtube_id,l2,title,level,topic,lesson,subs_l2`
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
