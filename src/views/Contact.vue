<template>
  <div class="container main mt-5 mb-5">
    <Page id="1" />
  </div>
</template>

<script>
import TelegramPrompt from '@/components/TelegramPrompt.vue'
import Page from '@/components/Page'

export default {
  components: {
    Page
  },
  computed: {
    isZh() {
      return this.$l2.code === 'zh'
    }
  }
}
</script>

<style></style>
