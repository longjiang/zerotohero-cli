<template>
  <div class="container main mt-5 mb-5">
    <div class="row">
      <div class="col-sm-12">
        <h1 class="mb-5 text-center">{{ $t('Contact {l2} Zero to Hero', {l2: $l2.name}) }}</h1>
      </div>
    </div>
    <div>
      <Page id="1" />
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

<style></style>
