<template>
  <div class="container-fluid main">
    <div class="row">
      <div class="col-md-4">
        <h4 class="mt-5 mb-4">Lesson Vocabulary</h4>
        <WordList :words="words"></WordList>
      </div>
      <div class="col-md-8">
        <h4 class="mt-5 mb-4">Videos</h4>
        <YouTubeVideoList :videos="videos" :checkSubs="true" :words="words" />
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
      videos: []
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
  methods: {
    async getVideos() {
      let response = await $.getJSON(
        `${Config.wiki}items/youtube_videos?sort=-id&filter[l2][eq]=${this.$l2.id}`
      )
      let videos = response.data || []
      this.videos = Helper.uniqueByValue(videos, 'youtube_id')
    },
    route() {
      this.getVideos()
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
    }
  }
}
</script>

<style>

</style>