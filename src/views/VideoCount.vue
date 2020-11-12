<template>
  <div class="container mt-5 mb-5">
    <Page id="9" v-if="$l1.code === 'en' && $l2.code === 'zh'" />
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

<style></style>
