<template>
  <div class="container-fluid main mb-5">
    <div class="row">
      <div class="col-md-4">
        <h4 class="mt-5">Lesson Vocabulary</h4>
        <p class="mb-4">{{ words.length - matchedWords.length }} unmatched words</p>
        <WordList :words="words" :matchedWords="matchedWords" :key="`matched-words-${matchedWordsKey}`"></WordList>
      </div>
      <div class="col-md-8">
        <h4 class="mt-5 mb-4">Lesson Videos</h4>
        <YouTubeVideoList :updateVideos="updateLessonVideos" :videos="lessonVideos" :checkSubs="true" :assignLessonMode="true" :lesson="lesson" :level="level" />
        <h4 class="mt-5 mb-4">More Videos</h4>
        <YouTubeVideoList :updateVideos="updateVideos" :videos="videos" :checkSubs="true" :assignLessonMode="true" :lesson="lesson" :level="level" />
      </div>
    </div>
  </div>
</template>

<script>
import WordList from '@/components/WordList'
import YouTubeVideoList from '@/components/YouTubeVideoList'
import Config from '@/lib/config'
import Helper from '@/lib/helper'

export default {
  data() {
    return {
      words: [],
      matchedWords: [],
      lessonVideos: [],
      videos: [],
      updateLessonVideos: 0,
      updateVideos: 0,
      matchedWordsKey: 0
    }
  },
  components: {
    WordList,
    YouTubeVideoList
  },
  props: ['level', 'lesson'],
  activated() {
    this.route()
  },
  watch: {
    $route() {
      if (this.$route.name === 'assign-lesson-videos') {
        this.route()
      }
    },
  },
  computed: {
    unmatchedWords() {
      return this.words.filter(word => !this.matchedWords.map(w => w.id).includes(word.id))
    },
  },
  methods: {
    async route() {
      this.words = await (await this.$dictionary).lookupByLesson(this.level, this.lesson)
      await this.getLessonVideos()
      await this.getVideos()
      this.updateVideos++
      this.updateLessonVideos++
    },
    async getLessonVideos() {
      let response = await $.getJSON(
        `${Config.wiki}items/youtube_videos?sort=-id&filter[l2][eq]=${this.$l2.id}&filter[level][eq]=${this.level}&filter[lesson][eq]=${this.lesson}`
      )
      let videos = response.data || []
      if (videos.length > 0) {
        videos = videos.map(video => {
          video.subs_l2 = JSON.parse(video.subs_l2)
          video.matches = this.matchWords(video)
          return video
        })
      }
      videos = videos.sort((a,b) => {
        let aScore = a.matches ? a.matches.length || 0 : 0
        let bScore = b.matches ? b.matches.length || 0 : 0
        return bScore - aScore
      })
      this.lessonVideos = Helper.uniqueByValue(videos, 'youtube_id')
      this.updateMatches()
      this.updateLessonVideos++
      return true
    },
    async getVideos() {
      let response = await $.getJSON(
        `${Config.wiki}items/youtube_videos?sort=-id&filter[l2][eq]=${this.$l2.id}&filter[lesson][null]`
      )
      let videos = response.data || []
      if (videos.length > 0) {
        videos = videos.map(video => {
          if(video.subs_l2) {
            video.subs_l2 = JSON.parse(video.subs_l2)
            video.matches = this.matchWords(video).filter(word => !this.matchedWords.map(w => w.id).includes(word.id))
          }
          return video
        })
      }
      videos = videos.sort((a,b) => {
        let aScore = a.matches ? a.matches.length || 0 : 0
        let bScore = b.matches ? b.matches.length || 0 : 0
        return bScore - aScore
      })
      videos = Helper.uniqueByValue(videos, 'youtube_id')
      if (this.lessonVideos.length > 0) {
        videos = videos.filter(video => {
          let overlap = this.lessonVideos.filter(lessonVideo => video.id === lessonVideo.id)
          return overlap.length === 0
        })
      }
      this.videos = videos
      return true
    },
    async addVideoToLesson(video) {
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
        this.lessonVideos.push(video)
        this.updateMatches()
        this.videos = this.videos.filter(v => v != video).map(video => {
          if(video.subs_l2) {
            video.matches = this.matchWords(video).filter(word => !this.matchedWords.map(w => w.id).includes(word.id))
          }
          return video
        }).sort((a,b) => {
          let aScore = a.matches ? a.matches.length || 0 : 0
          let bScore = b.matches ? b.matches.length || 0 : 0
          return bScore - aScore
        })
        this.updateVideos++
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
      return matches
    },
    updateMatches() { // called from child
      this.matchedWords = []
      for (let video of this.lessonVideos) {
        if (video.matches) {
          this.matchedWords = Helper.uniqueByValue(this.matchedWords.concat(video.matches), 'id')
        }
      }
      this.matchedWordsKey++
    }
  }
}
</script>

<style>

</style>