<template>
  <div class="container-fluid main">
    <div class="row">
      <div class="col-md-4">
        <h4 class="mt-5 mb-4">Lesson Vocabulary</h4>
        <WordList :words="words" :matchedWords="matchedWords" :key="`matched-words-${matchedWordsKey}`"></WordList>
      </div>
      <div class="col-md-8">
        <h4 class="mt-5 mb-4">Lesson Videos</h4>
        <YouTubeVideoList :videos="lessonVideos" :noThumbs="true" :checkSubs="true" :words="words" :lesson="lesson" :level="level" :key="`lesson-videos-${lessonVideoKey}`" />
        <h4 class="mt-5 mb-4">More Videos</h4>
        <YouTubeVideoList :videos="videos" :noThumbs="true" :checkSubs="true" :words="unmatchedWords" :lesson="lesson" :level="level" :key="`videos-${videoKey}`" />
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
      updateVideos: 0,
      lessonVideoKey: 0,
      videoKey: 0,
      matchedWordsKey: 0
    }
  },
  components: {
    WordList,
    YouTubeVideoList
  },
  props: ['level', 'lesson'],
  async mounted() {
    this.words = await (await this.$dictionary).lookupByLesson(this.level, this.lesson)
  },
  computed: {
    unmatchedWords() {
      return this.words.filter(word => !this.matchedWords.map(w => w.id).includes(word.id))
    },
  },
  methods: {
    async getVideos() {
      let response = await $.getJSON(
        `${Config.wiki}items/youtube_videos?sort=-id&filter[l2][eq]=${this.$l2.id}`
      )
      let videos = response.data || []
      if (videos.length > 0) {
        videos = videos.map(video => {
          video.subs_l2 = JSON.parse(video.subs_l2)
          return video
        })
      }
      this.videos = Helper.uniqueByValue(videos, 'youtube_id')
      if(this.lessonVideos.length > 0) {
        this.excludeLessonVideos()
      } else {
        this.videoKey++
      }
    },
    async getLessonVideos() {
      let response = await $.getJSON(
        `${Config.wiki}items/youtube_videos?sort=-id&filter[l2][eq]=${this.$l2.id}&filter[level][eq]=${this.level}&filter[lesson][eq]=${this.lesson}`
      )
      let videos = response.data || []
      if (videos.length > 0) {
        videos = videos.map(video => {
          video.subs_l2 = JSON.parse(video.subs_l2)
          return video
        })
      }
      this.lessonVideos = Helper.uniqueByValue(videos, 'youtube_id')
      this.lessonVideoKey++
      if(this.videos.length > 0) {
        this.excludeLessonVideos()
      }
    },
    excludeLessonVideos() {
      this.videos = this.videos.filter(video => {
        let overlap = this.lessonVideos.filter(lessonVideo => video.id === lessonVideo.id)
        return overlap.length === 0
      })
      this.videoKey++
    },
    route() {
      this.getVideos()
      this.getLessonVideos()
    },
    updateMatches() {
      this.matchedWords = []
      for (let video of this.lessonVideos) {
        if (video.matches) {
          this.matchedWords = Helper.uniqueByValue(this.matchedWords.concat(video.matches), 'id')
        }
      }
      this.matchedWordsKey++
    }
  },
  activated() {
    this.route()
  },
  watch: {
    $route() {
      if (this.$route.name === 'assign-lesson-videos') {
        this.route()
      }
    },
  }
}
</script>

<style>

</style>