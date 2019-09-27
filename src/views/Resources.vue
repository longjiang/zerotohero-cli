<template>
  <div class="main mt-5 mb-5">
    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-8 pr-4">
          <h3 class="mb-5">Resources for learning {{ $l2.name }}</h3>
          <ResourceList :resources="resources" />
        </div>
        <div class="col-sm-12 col-md-4">
          <h6 class="text-center mb-4">Topic</h6>
          <div class="list-group">
            <a
              :class="{
                'link-unstyled': true,
                'list-group-item': true,
                'list-group-item-action': topic === 'all',
                active: topic === 'all'
              }"
              :href="`#/${$l1.code}/${$l2.code}/resource/list/all/${topic}`"
            >All</a>
            <a
              v-for="(topicName, topicValue) in topics"
              :class="{
                'link-unstyled': true,
                'list-group-item': true,
                'list-group-item-action': topicValue === topic,
                active: topicValue === topic
              }"
              :href="`#/${$l1.code}/${$l2.code}/resource/list/${topicValue}/${type}`"
            >{{ topicName }}</a>
          </div>
          <h6 class="mt-4 mb-4 text-center">Format</h6>
          <div class="list-group">
            <a
              :class="{
                'link-unstyled': true,
                'list-group-item': true,
                'list-group-item-action': type === 'all',
                active: type === 'all'
              }"
              :href="`#/${$l1.code}/${$l2.code}/resource/list/${topic}/all`"
            >All</a>
            <a
              v-for="(typeName, typeValue) in types"
              :class="{
                'link-unstyled': true,
                'list-group-item': true,
                'list-group-item-action': typeValue === type,
                active: typeValue === type
              }"
              :href="`#/${$l1.code}/${$l2.code}/resource/list/${topic}/${typeValue}`"
            >{{ typeName }}</a>
          </div>
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
  props: ['topic', 'type'],
  data() {
    return {
      Config,
      Helper,
      resources: [],
      types: {
        av: 'Audio-Visual',
        games: 'Games',
        lists: 'Lists of Resources',
        music: 'Music',
        reading: 'Reading',
        software: 'Software',
        textbooks: 'Textbooks',
        multiple: 'Miscellaneous'
      },
      topics: {
        strategy: 'Learning Strategy',
        character: 'Characters',
        culture: 'Culture',
        grammar: 'Grammar',
        vocabulary: 'Vocabulary',
        multiple: 'Miscellaneous'
      }
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
      let filters = ''
      if (this.topic !== 'all') {
        filters += '&filter[topic][eq]=' + this.topic
      }
      if (this.type !== 'all') {
        filters += '&filter[type][eq]=' + this.type
      }
      let response = await $.getJSON(
        `${Config.wiki}items/resources?filter[l2][eq]=${this.$l2.id}${filters}&fields=*,thumbnail.*`
      )
      this.resources = response.data || []
    }
  },
  created() {
    this.route()
  }
}
</script>

<style></style>
