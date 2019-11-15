<template>
  <div class="container-fluid main">
    <div class="row">
      <div class="col-md-4">
        <h4 class="mb-4">Lesson Vocabulary</h4>
        <WordList :words="words"></WordList>
      </div>
      <div class="col-md-8">
        <h4 class="mb-4">Videos</h4>
      </div>
    </div>
  </div>
</template>

<script>
import WordList from '@/components/WordList'
export default {
  data() {
    return {
      words: []
    }
  },
  components: {
    WordList
  },
  props: ['level', 'lesson'],
  async mounted() {
    this.words = await (await this.$dictionary).lookupByLesson(this.level, this.lesson)
  }
}
</script>

<style>

</style>