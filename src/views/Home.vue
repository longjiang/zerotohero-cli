<template>
  <div class="main">
    <div class="container pt-5 pb-5">
      <div class="row">
        <div class="col-sm-12"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  activated() {
    if (
      this.$l1 &&
      this.$route.params.l1 === this.$l1.code &&
      (this.$l2 && this.$route.params.l2 === this.$l2.code)
    ) {
      if (this.$hasFeature('courses')) {
        this.$router.push({ name: 'courses' })
      } else if (this.$hasFeature('youtube')) {
        this.$router.push({ name: 'youtube-browse' })
      } else if (
        this.$hasFeature('dictionary') ||
        this.$hasFeature('transliteration')
      ) {
        this.$router.push({ name: 'reader' })
      } else {
        this.$router.push({ name: 'learning-path' })
      }
    }
  }
}
</script>

<style>
</style>
