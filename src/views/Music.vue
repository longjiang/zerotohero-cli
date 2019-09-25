<template>
  <div class="music">
    <div class="container main mt-5 mb-5">
      <div class="row">
        <div class="col-sm-12">
          <h1 class="mb-5 text-center">Study Music Lyrics</h1>
          <div class="search-compare-wrapper">
            <Search
              placeholder="Lookup a song or artist (in Chinese characters)"
              type="generic"
              :term="args"
              :defaultURL="text => `#/music/search/${text}`"
            />
          </div>
          <Song
            v-for="(lrc, lrcIndex) in lrcs"
            :lrc="lrc"
            :lrcIndex="lrcIndex"
            :collapse="true"
          />
          <div class="text-center mt-5">
            <Loader v-if="loading" :sticky="true" />
          </div>
          <div v-if="notFound" class="mt-5 text-center rounded p-4 bg-light">
            Sorry, we could not find a artist or song that includes “{{
              args
            }}”.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LRC from '@/lib/lrc'
import Search from '@/components/Search'
import Song from '@/components/Song'

export default {
  components: {
    Search,
    Song
  },
  props: {
    method: {
      type: String
    },
    args: {
      type: String
    }
  },
  data() {
    return {
      lrcs: [],
      loading: false,
      notFound: false
    }
  },
  methods: {
    route() {
      this.notFound = false
      this.loading = false
      this.lrcs = []
      if (this.method && this.args) {
        let method = this.method
        let args = this.args.split(',')
        if (method === 'search') {
          let artistOrTitle = args[0]
          this.loading = true
          LRC.getLrcsByArtistOrTitle(artistOrTitle).then(lrcs => {
            this.loading = false
            this.lrcs = lrcs
            this.notFound = lrcs.length === 0
          })
        }
      }
    }
  },
  watch: {
    $route() {
      if (this.$route.name === 'music') {
        this.route()
      }
    }
  },
  mounted() {
    this.route()
  }
}
</script>

<style></style>
