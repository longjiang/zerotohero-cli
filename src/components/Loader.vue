<template>
  <div id="loader" v-if="loading" class="d-inline-block text-center">
    <div class="heartbeat-loader mb-4"></div>
    <div>
      <slot>Loading</slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sticky: {
      default: false
    }
  },
  data() {
    return {
      loading: true
    }
  },
  async mounted() {
    await this.$dictionary
    this.loading = false
  }
}
</script>
<style></style>
