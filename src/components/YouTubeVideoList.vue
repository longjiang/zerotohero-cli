<template>
  <div class="youtube-videos">
    <div v-for="video of videos" :class="{
      'youtube-video': true,
      'media': true,
      'rounded': true,
      'shadow': true,
      'nosubs': (!video.checkingSubs) && (!video.hasSubs)
      }" :key="`${video.youtube_id}-${videosKey}`">
      <a :href="`#/${$l1.code}/${$l2.code}/youtube/view/${video.youtube_id}`" class="youtube-link">
        <div class="youtube-thumbnail-wrapper aspect-wrapper">
          <img :src="video.thumbnail || `//img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`" class="youtube-thumbnail aspect" />
        </div>
        <div class="media-body">
          <div class="youtube-title">{{ video.title }}</div>
          <div v-if="video.hasSubs" class="btn btn-small bg-success text-white mt-2">{{ $l2.name }} CC</div>
          <div v-if="(video.checkingSubs === false) && (video.hasSubs === false)" class="btn btn-small text-white bg-dark mt-2">No {{ $l2.name }} CC</div>
          <div v-if="video.youtube_id && !video.topic" class="btn btn-small text-white bg-danger mt-2">Uncategorized</div>
          <div v-if="video.youtube_id && video.topic" class="btn btn-small btn-gray mt-2 ml-0">{{ Helper.topics[video.topic] }}</div>
          <div v-if="video.youtube_id && video.level" class="btn btn-small btn-gray mt-2 ml-0">{{ Helper.level(video.level, $l2) }}</div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import Helper from '@/lib/helper'
export default {
  data() {
    return {
      Helper,
      videosKey: 0
    }
  },
  props: {
    videos: {
      type: Array
    },
    checkSubs: {
      default: false
    },
    words: {
      default: undefined
    }
  },
  mounted() {
    if(this.checkSubs) {
      this.getAllSubs()
    }
  },
  watch: {
    videos() {
      if(this.checkSubs) {
        this.getAllSubs()
      }
    }
  },
  methods: {
    getAllSubs() {
      for(let video of this.videos) {
        this.getSubs(video)
      }
    },
    async getSubs(video) {
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
            `https://www.youtube.com/api/timedtext?v=${video.youtube_id}&lang=${locale}&fmt=srv3`
          ).then($html => {
            if ($html && !video.hasSubs) {
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

<style lang="scss">
.youtube-videos {
  display: flex;
  flex-wrap: wrap;
}
.youtube-video {
  min-width: 15rem;
  flex: 1;
  margin: 1rem;
}

a.youtube-link,
a.youtube-link:hover {
  color: #666;
  text-decoration: none;
  .youtube-title {
    font-weight: bold;
  }
}
</style>
