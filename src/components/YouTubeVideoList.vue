<template>
  <div class="youtube-videos" :key="videosKey">
    <div v-for="video of videos" :class="{
      'youtube-video': true,
      'media': true,
      'rounded': true,
      'shadow': true,
      'nosubs': (!video.checkingSubs) && (!video.hasSubs)
      }">
      <div class="youtube-link">
        <a :href="`#/${$l1.code}/${$l2.code}/youtube/view/${video.youtube_id}`" class="youtube-thumbnail-wrapper aspect-wrapper d-block">
          <img v-if="!noThumbs" :src="video.thumbnail || `//img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`" class="youtube-thumbnail aspect" />
        </a>
        <div class="media-body">
          <a :href="`#/${$l1.code}/${$l2.code}/youtube/view/${video.youtube_id}`" class="youtube-title d-block">{{ video.title }}</a>
          <div v-if="words && video.matches && video.matches.length > 0" class="btn btn-small bg-warning text-white mt-2 ml-0">{{ video.matches.length }} matched words</div>
          <div v-if="video.hasSubs" class="btn btn-small bg-success text-white mt-2">{{ $l2.name }} CC</div>
          <div v-if="(video.checkingSubs === false) && (video.hasSubs === false)" class="btn btn-small text-white bg-dark mt-2">No {{ $l2.name }} CC</div>
          <div v-if="video.youtube_id && !video.topic" class="btn btn-small text-white bg-danger mt-2">Uncategorized</div>
          <div v-if="video.youtube_id && video.topic" class="btn btn-small btn-gray mt-2 ml-0">{{ Helper.topics[video.topic] }}</div>
          <div v-if="video.youtube_id && video.level" class="btn btn-small btn-gray mt-2 ml-0">{{ Helper.level(video.level, $l2) }}</div>
          <b-button class="d-block" v-if="words && video.level !== level && video.lesson !== lesson" @click="add(video)"><i class="fas fa-plus mr-2"></i>Add to Lesson</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Helper from '@/lib/helper'
import Config from '@/lib/config'
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
    },
    level: {
      default: undefined
    },
    lesson: {
      default: undefined
    },
    updateVideos: {
      default: 0
    },
    noThumbs: {
      default: false
    }
  },
  mounted() {
    if(this.checkSubs) {
      this.getAllSubs()
    }
  },
  watch: {
    updateVideos() {
      if(this.checkSubs) {
        this.getAllSubs()
      }
    }
  },
  methods: {
    async add(video) {
      let response = await $.ajax({
        url: `${Config.wiki}items/youtube_videos/${video.id}`,
        data: JSON.stringify({ level: this.level, lesson: this.lesson }),
        type: 'PATCH',
        contentType: 'application/json',
        xhr: function() {
          return window.XMLHttpRequest == null ||
            new window.XMLHttpRequest().addEventListener == null
            ? new window.ActiveXObject('Microsoft.XMLHTTP')
            : $.ajaxSettings.xhr()
        }
      })
      if (response && response.data) {
        video = Object.assign(video, response.data)
      }
    },
    getAllSubs() {
      for(let video of this.videos) {
        this.getSubs(video)
      }
    },
    matchWords(video) {
      let matches = []
      video.text = video.subs_l2.map(line => line.line).join('\n')
      if (this.words && this.words.length > 0) {
        for (let word of this.words) {
          if (video.text.includes(word.simplified) || video.text.includes(word.traditional) || video.text.includes(word.head)) {
            matches.push(word)
          }
        }
      }
      video.matches = matches
      if (this.$parent.updateMatches) {
        this.$parent.updateMatches()
      }
    },
    async saveSubs(video) {
      let response = await $.ajax({
        url: `${Config.wiki}items/youtube_videos/${video.id}`,
        data: JSON.stringify({ subs_l2: JSON.stringify(video.subs_l2) }),
        type: 'PATCH',
        contentType: 'application/json',
        xhr: function() {
          return window.XMLHttpRequest == null ||
            new window.XMLHttpRequest().addEventListener == null
            ? new window.ActiveXObject('Microsoft.XMLHTTP')
            : $.ajaxSettings.xhr()
        }
      })
    },
    checkWords(video) {
      if (this.words) {
        this.matchWords(video)
        this.videos = this.videos.sort((a,b) => {
          let aScore = a.matches ? a.matches.length || 0 : 0
          let bScore = b.matches ? b.matches.length || 0 : 0
          return bScore - aScore
        })
      }
    },
    async getSubs(video) {
      video.checkingSubs = true
      video.hasSubs = false
      if (video.subs_l2 && video.subs_l2.length > 0) {
        video.hasSubs = true
        video.checkingSubs = false
        this.checkWords(video)
      } else {
        const promises = []
        let locales = [this.$l2.code]
        if (this.$l2.locales) {
          locales = locales.concat(this.$l2.locales)
        }
        for (let locale of locales) {
          promises.push(
            Helper.scrape2(
              `https://www.youtube.com/api/timedtext?v=${video.youtube_id}&lang=${locale}&fmt=srv3`
            ).then($html => {
              if ($html && !video.hasSubs) {
                video.subs_l2 = []
                for (let p of $html.find('p')) {
                  if ($(p).text().length === 0) return
                  let line = {
                    line: $(p).text(),
                    starttime: parseInt($(p).attr('t')) / 1000
                  }
                  video.subs_l2.push(line)
                }
                if (video.subs_l2.length > 3 && video.subs_l2.join('').length > 20) {
                  video.hasSubs = true
                  if (video.id) this.saveSubs(video)
                  this.checkWords(video)
                  this.videosKey++
                }
              }
            })
          )
        }
        await Promise.all(promises)
        video.checkingSubs = false
      }
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
