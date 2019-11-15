<template>
  <div class="container-fluid main">
    <div class="row">
      <div class="col-md-4">
        <h4 class="mt-5 mb-4">Lesson Vocabulary</h4>
        <WordList :words="words"></WordList>
      </div>
      <div class="col-md-8">
        <YouTubeBrowse :checkSubs="true" />
      </div>
    </div>
  </div>
</template>

<script>
import WordList from '@/components/WordList'
import YouTubeBrowse from '@/views/YouTubeBrowse'

export default {
  data() {
    return {
      words: []
    }
  },
  components: {
    WordList,
    YouTubeBrowse
  },
  props: ['level', 'lesson'],
  async mounted() {
    this.words = await (await this.$dictionary).lookupByLesson(this.level, this.lesson)
  }
}
</script>

<style>

</style>