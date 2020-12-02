<template>
  <div class="faq container mt-5 mb-5">
    <div class="row" v-if="$l1.code === 'en' && $l2.code === 'zh'">
      <Page id="2" />
    </div>
    <div class="row" v-if="$l1.code === 'zh' && $l2.code === 'en'">
      <Page id="3" />
    </div>
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

<style scoped>
* >>> h5 {
  margin-top: 2rem;
}

* >>> h5 + div {
  padding-left: 2rem;
}
</style>