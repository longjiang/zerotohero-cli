<template>
  <div>
    <div class="row">
      <div
        class="col-md-6 col-lg-4 mb-5"
        v-for="hero in heroes"
        v-if="filter(hero)"
      >
        <Hero :hero="hero" />
      </div>
    </div>
  </div>
</template>

<script>
import Config from '@/lib/config'
import Hero from '@/components/Hero'

export default {
  components: {
    Hero
  },
  props: {
    category: {
      type: String
    },
    filter: {
      type: Function,
      default: () => true
    }
  },
  data() {
    return {
      heroes: []
    }
  },
  mounted() {
    this.get()
  },
  methods: {
    get() {
      $.getJSON(`${Config.wiki}items/heroes?fields=*,avatar.*`, response => {
        this.heroes = response.data
          .map(hero => {
            hero.url = `#/hall-of-heroes/view/${hero.id},${encodeURIComponent(
              hero.name
            )}`
            return hero
          })
          .sort((a, b) => {
            return b.score - a.score
          })
          .sort((a, b) => {
            return b.hsk - a.hsk
          })
      })
    }
  }
}
</script>

<style></style>
