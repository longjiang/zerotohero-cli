<template>
  <div class="container main mt-4 mb-4" v-cloak>
    <div class="row">
      <div class="col-sm-12">
        <div>
          <h4>Browse Words by Theme</h4>
          <p>Themes are as classified under the Dewey decimal system.</p>
          <hr />
          <Loader class="mt-5" />
          <ThemeBrowser />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ThemeBrowser from '@/components/ThemeBrowser.vue'

export default {
  components: {
    ThemeBrowser
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
