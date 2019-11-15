<template>
  <div>
    <YouTubeVideoList :videos="videos" :key="videosKey" />
    <div class="mt-4 text-center">
      <a v-if="start > 9" :href="`#/${$l1.code}/${$l2.code}/youtube/search/${encodeURIComponent(term)}/${Number(start) - 10}`" class="btn btn-default mr-2">Previous</a>
      <a :href="`#/${$l1.code}/${$l2.code}/youtube/search/${encodeURIComponent(term)}/${Number(start) + 10}`" class="btn btn-default">Next</a>
    </div>
  </div>
</template>

<script>
import Helper from '@/lib/helper'
import YouTube from '@/lib/youtube'
import YouTubeVideoList from '@/components/YouTubeVideoList'

export default {
  components: {
    YouTubeVideoList
  },
  props: {
    term: {
      type: String
    },
    start: {
      default: 0
    }
  },
  data() {
    return {
      videos: [],
      videosKey: 0
    }
  },
  mounted() {
    this.updateURL()
  },
  watch: {
    term() {
      this.updateURL()
    },
    start() {
      this.updateURL()
    }
  },
  methods: {
    async updateURL() {
      this.videos = []
      let videos = await YouTube.searchByGoogle(
        {
          term: this.term,
          start: this.start || 0,
          lang: this.$l2.code,
          captions: true
        }
      )
      this.videos = videos
      for(let video of this.videos) {
        this.checkSubs(video)
      }
    },
    async checkSubs(video) {
      const promises = []
      let locales = [this.$l2.code]
      if (this.$l2.locales) {
        locales = locales.concat(this.$l2.locales)
      }
      video.checkingSubs = true
      video.hasSubs = false
      for (let locale of locales) {
        promises.push(
          Helper.scrape2(
            `https://www.youtube.com/api/timedtext?v=${video.id}&lang=${locale}&fmt=srv3`
          ).then($html => {
            if ($html) {
              video.l2Lines = []
              for (let p of $html.find('p')) {
                if ($(p).text().length === 0) return
                let line = {
                  line: $(p).text(),
                  starttime: parseInt($(p).attr('t')) / 1000
                }
                video.l2Lines.push(line)
              }
              if (video.l2Lines.length > 3 && video.l2Lines.join('').length > 20) {
                video.hasSubs = true
              }
            }
          })
        )
      }
      await Promise.all(promises)
      video.checkingSubs = false
      this.videosKey++
    },
  }

}
</script>

<style>

</style>