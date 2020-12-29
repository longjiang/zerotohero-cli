<template>
  <div class="container mb-5">
    <div class="row">
      <div class="col-sm-12">
        <Page id="16" />
        <div class="text-center mt-5 mb-5 filter">
          <button
            @click="filter = hero => hero"
            class="btn mr-2"
            data-bg-level="outside"
          >
            All
          </button>
          <button
            v-for="hsk in ['1', '2', '3', '4', '5']"
            @click="filter = hero => hero.hsk === hsk"
            class="btn mr-2"
            :data-bg-level="hsk"
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
import Page from '@/components/Page'

export default {
  components: {
    HeroesList,
    Page
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
