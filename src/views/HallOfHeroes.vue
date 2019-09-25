<template>
  <div class="container mb-5">
    <div class="row">
      <div class="col-sm-12">
        <h1 class="text-center mt-5 mb-5">Hall of Heroes</h1>
        <p class="lead text-center">
          <b>Every “hero” was a “zero” at some point.</b>
        </p>
        <p>
          With hard work and continuous effort learning the Mandarin language,
          many have improved tremendously. In this page we showcase some of our
          students that have successfully passed the HSK exams after taking
          courses from us!
        </p>
        <div class="text-center mt-5 mb-5 filter">
          <button
            @click="filter = hero => hero"
            class="btn mr-2"
            data-bg-hsk="outside"
          >
            All
          </button>
          <button
            v-for="hsk in ['1', '2', '3', '4', '5']"
            @click="filter = hero => hero.hsk === hsk"
            class="btn mr-2"
            :data-bg-hsk="hsk"
          >
            HSK {{ hsk }}
          </button>
        </div>
        <HeroesList category="featured" class="mt-5" :filter="filter" />
      </div>
    </div>
  </div>
</template>

<script>
import HeroesList from '@/components/HeroesList'

export default {
  components: {
    HeroesList
  },
  data() {
    return {
      filter: hero => hero
    }
  }
}
</script>

<style scoped>
.filter {
  line-height: 3;
}
</style>
