<template>
  <div class="entry-youtube widget">
    <div class="widget-title">{{ $t('“{text}” videos on YouTube', {text: text})}}</div>
    <div class="widget-body jumbotron-fluid p-4">
      <YouTubeSearchResults :term="text" :start="0" />
      <template v-if="$l2.code === 'zh'">
        <p class="mt-5 text-center">See examples of “{{ text }}” on <a :href="`https://youglish.com/pronounce/${text}/chinese`" target="youglish"><img style="margin-bottom: 1em" src="/img/logo-youglish-cn.png"/></a></p>
      </template>
    </div>
  </div>
</template>

<script>
import YouTube from '@/lib/youtube'
import YouTubeSearchResults from '@/components/YouTubeSearchResults'

export default {
  components: {
    YouTubeSearchResults
  },
  props: {
    text: {
      type: String
    }
  },
}
</script>

<style></style>
