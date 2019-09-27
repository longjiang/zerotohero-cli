<template>
  <div class="main mt-5 mb-5">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <h3>
            Learning Resources
          </h3>
          <hr>
          <p class="mb-5">
            This is a collection of learning resources.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-4">
          <div class="list-group">
            <a class="list-group-item list-group-item-action active">All</a>
            <a class="list-group-item">Courses</a>
            <a class="list-group-item">Tutoring</a>
            <a class="list-group-item">Dictionaries</a>
            <a class="list-group-item">Flashcard</a>
            <a class="list-group-item">Books (Readers)</a>
          </div>
        </div>
        <div class="col-sm-12 col-md-8">
          <ResourceList :resources="resources" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Config from '@/lib/config'
import Helper from '@/lib/helper'
import ResourceList from '@/components/ResourceList'

export default {
  components: {
    ResourceList
  },
  props: ['type'],
  data() {
    return {
      Config,
      Helper,
      resources: []
    }
  },
  watch: {
    $route() {
      if (this.$route.name === 'resources') {
        this.route()
      }
    }
  },
  methods: {
    async route() {
      let response = await $.getJSON(`${Config.wiki}items/resources?filter[l2][eq]=${this.$l2.id}&fields=*,thumbnail.*`)
      this.resources = response.data || []
    }
  },
  created() {
    this.route()
  }
}
</script>

<style></style>
