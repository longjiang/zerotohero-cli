<template>
  <div class="youtube-videos">
    <div v-for="video of videos" :class="{
      'youtube-video': true,
      'media': true,
      'rounded': true,
      'shadow': true,
      'nosubs': (!video.checkingSubs) && (!video.hasSubs)
      }">
      <a :href="`#/${$l1.code}/${$l2.code}/youtube/view/${video.youtube_id || video.id}`" class="youtube-link">
        <div class="youtube-thumbnail-wrapper aspect-wrapper">
          <img :src="video.thumbnail || `//img.youtube.com/vi/${video.youtube_id || video.id}/hqdefault.jpg`" class="youtube-thumbnail aspect" />
        </div>
        <div class="media-body">
          <div class="youtube-title">{{ video.title }}</div>
          <div v-if="video.hasSubs" class="btn btn-small bg-success text-white mt-2">{{ $l2.name }} CC</div>
          <div v-if="(video.checkingSubs === false) && (video.hasSubs === false)" class="btn btn-small text-white bg-dark mt-2">No {{ $l2.name }} CC</div>
          <div v-if="video.youtube_id && !video.topic" class="btn btn-small text-white bg-danger mt-2">Uncategorized</div>
          <div v-if="video.youtube_id && video.topic" class="btn btn-small btn-gray mt-2 ml-0">{{ Helper.topics[video.topic] }}</div>
          <div v-if="video.youtube_id && video.level" class="btn btn-small btn-gray mt-2 ml-0">{{ Helper.level(video.level, $l2) }}</div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import Helper from '@/lib/helper'
export default {
  data() {
    return {
      Helper
    }
  },
  props: {
    videos: {
      type: Array
    }
  }
}
</script>

<style lang="scss">
.youtube-videos {
  display: flex;
  flex-wrap: wrap;
}
.youtube-video {
  min-width: 15rem;
  flex: 1;
  margin: 1rem;
}

a.youtube-link,
a.youtube-link:hover {
  color: #666;
  text-decoration: none;
  .youtube-title {
    font-weight: bold;
  }
}
</style>
