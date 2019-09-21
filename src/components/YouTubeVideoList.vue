<template>
  <div class="youtube-videos">
    <div v-for="video of videos" class="youtube-video media rounded shadow">
      <a :href="`#/${$lang.code}/youtube/view/${video.id}`" class="youtube-link">
        <div class="youtube-thumbnail-wrapper aspect-wrapper">
          <img :src="video.thumbnail" class="youtube-thumbnail aspect" />
        </div>
        <div class="youtube-title media-body"><Annotate><span>{{ video.title }}</span></Annotate></div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
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
