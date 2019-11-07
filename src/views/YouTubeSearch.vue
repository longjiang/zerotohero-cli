<template>
  <div class="container pt-5 pb-5 main youtube-search">
    <h1 class="text-center mb-5">Study YouTube Subtitles</h1>
    <SimpleSearch
      :placeholder="$t('Enter a search term in {l2}...', {l2: $l2.name})"
      :action="
        url => {
          location.hash = `#/${$l1.code}/${$l2.code}/youtube/search/${encodeURIComponent(url)}/0`
        }
      "
      ref="search"
      class="mb-5"
    />
    <YouTubeVideoList :videos="videos" :key="videosKey" />
    <div class="mt-4 text-center">
      <a v-if="start > 9" :href="`#/${$l1.code}/${$l2.code}/youtube/search/${encodeURIComponent(term)}/${Number(start) - 10}`" class="btn btn-default mr-2">Previous</a>
      <a :href="`#/${$l1.code}/${$l2.code}/youtube/search/${encodeURIComponent(term)}/${Number(start) + 10}`" class="btn btn-default">Next</a>
    </div>
  </div>
</template>

<script>
import YouTube from '@/lib/youtube'
import YouTubeVideoList from '@/components/YouTubeVideoList'
import SimpleSearch from '@/components/SimpleSearch'
import Helper from '@/lib/helper'
import Vue from 'vue'

export default {
  components: {
    YouTubeVideoList,
    SimpleSearch
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
      location,
      videos: [],
      videosKey: 0
    }
  },
  watch: {
    term() {
      this.updateURL()
    },
    start() {
      this.updateURL()
    }
  },
  mounted() {
    this.updateURL()
  },
  methods: {
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
    async updateURL() {
      this.videos = []
      let url = decodeURIComponent(this.term)
      this.$refs.search.text = url
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
    }
  }
}
</script>

<style>
.youtube-search .youtube-video.nosubs {
  opacity: 0.2;
}
</style>
