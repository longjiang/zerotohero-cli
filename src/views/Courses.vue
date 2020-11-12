<template>
  <div>
    <Page id="5" v-if="$l1.code === 'en' && $l2.code === 'zh'" />
    <Page id="6" v-if="$l1.code === 'zh' && $l2.code === 'en'" />
  </div>
</template>

<script>
import Page from '@/components/Page'

export default {
  components: {
    Page
  }
}
</script>

<style>
.courses a:not(.btn) {
  color: inherit;
}

.courses a:hover {
  text-decoration: none;
}

.photo-jon,
.photo-ken {
  position: absolute;
  bottom: 0;
}
.photo-jon {
  height: 70%;
  right: 0;
}
.photo-ken {
  height: 90%;
  left: 0;
}

.intro-video {
  z-index: 2;
  position: inherit;
}

@media (max-width: 576px) {
  .intro-video {
    width: 100%;
  }
}
</style>
