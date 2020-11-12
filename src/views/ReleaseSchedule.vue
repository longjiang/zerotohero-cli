<template>
  <div class="container mt-5 mb-5">
    <Page id="12" v-if="$l1.code === 'en' && $l2.code === 'zh'" />
    <Page id="13" v-if="$l1.code === 'zh' && $l2.code === 'en'" />
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
  div >>> td:first-child {
    color: white;
  }
</style>
