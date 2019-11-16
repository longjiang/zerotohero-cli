<template>
  <div class="youtube-videos">
    <div v-for="(video, videoIndex) in videos" :class="{
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
        <div class="media-body" :key="`video-${videoIndex}-${videosInfoKey}`">
          <a :href="`#/${$l1.code}/${$l2.code}/youtube/view/${video.youtube_id}`" class="youtube-title d-block">{{ video.title }}</a>
          <div v-if="assignLessonMode && video.matches && video.matches.length > 0" class="btn btn-small bg-warning text-white mt-2 ml-0">{{ video.matches.length }} matched words</div>
          <div v-if="video.hasSubs" class="btn btn-small bg-success text-white mt-2">{{ $l2.name }} CC</div>
          <div v-if="(video.checkingSubs === false) && (video.hasSubs === false)" class="btn btn-small text-white bg-dark mt-2">No {{ $l2.name }} CC</div>
          <div v-if="video.id && !video.topic" class="btn btn-small text-white bg-danger mt-2">Uncategorized</div>
          <div v-if="video.id && video.topic" class="btn btn-small btn-gray mt-2 ml-0">{{ Helper.topics[video.topic] }}</div>
          <div v-if="video.id && video.level" class="btn btn-small btn-gray mt-2 ml-0">{{ Helper.level(video.level, $l2) }}</div>
          <b-button class="d-block" v-if="assignLessonMode && !video.lesson" @click="add(video)"><i class="fas fa-plus mr-2"></i>Add to Lesson</b-button>
          <div v-if="assignLessonMode && video.matches && video.matches.length > 0">
            <span v-for="word in video.matches">{{ word.head }} </span>
          </div>
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
      Helper
    }
  },
  props: {
    videos: {
      type: Array
    },
    checkSubs: {
      default: false
    },
    updateVideos: {
      default: 0
    },
    noThumbs: {
      default: false
    },
    assignLessonMode: {
      default: false
    },
    lesson: {
      default: false
    },
    level: {
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
      console.log('updated')
      if(this.checkSubs) {
      console.log('checking subs')
        this.getAllSubs()
      }
    }
  },
  methods: {
    add(video) {
      if (this.$parent.addVideoToLesson) this.$parent.addVideoToLesson(video)
    },
    getAllSubs() {
      for(let video of this.videos) {
        this.getSubs(video)
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
    async getSaved(video) {
      let saved = undefined
      let response = await $.getJSON(
        `${Config.wiki}items/youtube_videos?filter[youtube_id][eq]=${video.youtube_id}&filter[l2][eq]=${this.$l2.id}`
      )
      if (response && response.data && response.data.length > 0) {
        return response.data[0]
      } else {
        return false
      }
    },
    parseSubs($html) {
      let lines = []
      for (let p of $html.find('p')) {
        if ($(p).text().length === 0) return
        let line = {
          line: $(p).text(),
          starttime: parseInt($(p).attr('t')) / 1000
        }
        lines.push(line)
      }
      return lines
    },
    async save(video) {
      let response = await $.post(`${Config.wiki}items/youtube_videos`, {
        youtube_id: video.youtube_id,
        title: video.title,
        l2: this.$l2.id,
        subs_l2: JSON.stringify(video.subs_l2)
      })
      if (response && response.data) {
        video.id = response.data.id
      }
    },
    async saveVideoOrJustSubs(video) {
      let savedVideo = await this.getSaved(video)
      if (savedVideo) {
        video = Object.assign(video, savedVideo)
        if (!video.subs_l2) {
          this.saveSubs(video)
        }
      } else {
        this.save(video)
      }
      this.videosInfoKey++
    },
    async getSubs(video) {
      video.checkingSubs = true
      video.hasSubs = false
      if (video.subs_l2 && video.subs_l2.length > 0) {
        video.hasSubs = true
        video.checkingSubs = false
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
                video.subs_l2 = this.parseSubs($html)
                if (video.subs_l2.length > 3 && video.subs_l2.join('').length > 20) {
                  video.hasSubs = true
                  video.checkingSubs = false
                  this.saveVideoOrJustSubs(video)
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

.youtube-video.nosubs {
  opacity: 0.2;
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
