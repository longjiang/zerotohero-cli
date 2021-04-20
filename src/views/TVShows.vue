<template>
  <div class="main container" id="main">
    <div class="row">
      <div class="col-sm-12">
        <h1 class="text-center mt-5 mb-5">TV Shows</h1>
        <div class="tv-shows mb-5">
          <div class="tv-show media rounded shadow" v-for="show of shows">
            <router-link
              class="youtube-thumbnail-wrapper aspect-wrapper d-block"
              :to="`/${$l1.code}/${$l2.code}/youtube/browse/all/all/0/${show.title}`"
            >
              <img
                :src="`//img.youtube.com/vi/${show.youtube_id}/hqdefault.jpg`"
                class="youtube-thumbnail aspect"
              />
            </router-link>
            <div class="media-body">
              <router-link
                :to="`/${$l1.code}/${$l2.code}/youtube/browse/all/all/0/${show.title}`"
                class="link-unstyled"
              >
                <h6>
                  <Annotate>
                    <span>{{ show.title }}</span>
                  </Annotate>
                </h6>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeNav from '@/components/YouTubeNav'
import YouTubeVideoList from '@/components/YouTubeVideoList'
import YouTubeChannelCard from '@/components/YouTubeChannelCard'
import SimpleSearch from '@/components/SimpleSearch'
import Config from '@/lib/config'
import Helper from '@/lib/helper'

export default {
  data() {
    return {
      shows: [],
    }
  },
  mounted() {
    this.getTVShows()
  },
  methods: {
    async getTVShows() {
      let response = await $.getJSON(
        `${Config.wiki}items/tv_shows?sort=title&filter[l2][eq]=${
          this.$l2.id
        }&timestamp=${this.$settings.adminMode ? Date.now() : 0}`
      )
      this.shows = response.data || []
    },
  },
}
</script>

<style scoped>
.tv-shows {
  display: flex;
  flex-wrap: wrap;
}
.tv-show {
  min-width: 15rem;
  max-width: 480px;
  flex: 1;
  margin-right: 1rem;
  margin-bottom: 1rem;
}
.tv-show-thumbnail {
  width: 100%;
  max-height: 270px;
  object-fit: cover;
}
</style>