<template>
  <div class="youtube-browse container mt-5 mb-5 main">
    <div class="row">
      <div class="col-sm-12">
        <SimpleSearch
          class="mb-3"
          :placeholder="$t('Search YouTube', { l2: $l2.name })"
          buttonText="Search"
          :action="
            url => {
              location.hash = `#/${$l1.code}/${
                $l2.code
              }/youtube/search/${encodeURIComponent(url)}`
            }
          "
          ref="search"
        />
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-sm-12 col-md-8 col-lg-9 pr-4 mb-5">
        <template v-if="videos && videos.length > 0">
          <h4 class="mb-4 text-center">{{ Math.min(videos.length, 100) }}{{ videos.length > 100 ? '+' : '' }} {{ topic === 'all' ? $t('New') : ''}} {{ $t('Videos') }}</h4>
          <YouTubeVideoList :videos="videos" />
        </template>
        <template v-if="channels && channels.length > 0">
          <h4 class="mt-5 mb-4 text-center">{{ channels.length }} {{ $t('Channels') }}</h4>
          <ul class="list-unstyled p-0 mb-5 cards">
            <li v-for="channel in channels" class="p-4 mb-4 card">
              <YouTubeChannelCard :channel="channel" />
            </li>
          </ul>
        </template>
      </div>
      <div class="col-sm-12 col-md-4 col-lg-3">
        <h4 class="text-center mb-4">Topics</h4>
        <div class="list-group">
          <a
            :class="{
                'link-unstyled': true,
                'list-group-item': true,
                'list-group-item-action': topic === 'all',
                active: topic === 'all'
              }"
            :href="`#/${$l1.code}/${$l2.code}/youtube/browse/all/${level}`"
          >All</a>
          <a
            v-for="(topicName, topicValue) in topics"
            :class="{
                'link-unstyled': true,
                'list-group-item': true,
                'list-group-item-action': topicValue === topic,
                active: topicValue === topic
              }"
            :href="`#/${$l1.code}/${$l2.code}/youtube/browse/${topicValue}/all`"
          >{{ topicName }}</a>
        </div>
        <h6 class="mt-4 mb-4 text-center">Level</h6>
        <div class="list-group">
          <a
            :class="{
                'link-unstyled': true,
                'list-group-item': true,
                'list-group-item-action':  level === 'all',
                active: level === 'all'
              }"
            :href="`#/${$l1.code}/${$l2.code}/youtube/browse/${topic}/all`"
          >All</a>
          <a
            v-for="(levelName, levelValue) in levels"
            :class="{
                'link-unstyled': true,
                'list-group-item': true,
                'list-group-item-action': levelValue === level,
                active: levelValue === level
              }"
            :href="`#/${$l1.code}/${$l2.code}/youtube/browse/all/${levelValue}`"
          >{{ levelName }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeNav from '@/components/YouTubeNav'
import YouTubeVideoList from '@/components/YouTubeVideoList'
import YouTubeChannelCard from '@/components/YouTubeChannelCard'
import SimpleSearch from '@/components/SimpleSearch'
import Config from '@/lib/config'
import Helper from '@/lib/helper'

export default {
  components: {
    YouTubeNav,
    YouTubeVideoList,
    YouTubeChannelCard,
    SimpleSearch
  },
  props: {
    args: {
      type: String
    },
    topic: {
      default: 'all'
    },
    level: {
      default: 'all'
    }
  },
  data() {
    return {
      location,
      channels: [],
      videos: [],
      levels: Helper.levels(this.$l2),
      topics: Helper.topics
    }
  },
  methods: {
    async getVideos() {
      let filters = ''
      if (this.topic !== 'all') {
        filters += '&filter[topic][eq]=' + this.topic
      }
      if (this.level !== 'all') {
        filters += '&filter[level][eq]=' + this.level
      }
      let response = await $.getJSON(
        `${Config.wiki}items/youtube_videos?sort=-id&filter[l2][eq]=${this.$l2.id}${filters}`
      )
      let videos = response.data || []
      this.videos = Helper.uniqueByValue(videos, 'youtube_id')
    },
    async getChannels() {
      let response = await $.getJSON(
        `${Config.wiki}items/youtube_channels?filter[language][eq]=${this.$l2.id}&fields=*,avatar.*`
      )
      if (response.data && response.data.length > 0) {
        let channels = response.data.map(channel => {
          return {
            id: channel.channel_id,
            avatar: channel.avatar && channel.avatar !== null ? channel.avatar.data.full_url : undefined,
            title: channel.name,
            description: channel.description
          }
        })
        channels = Helper.uniqueByValue(channels, 'youtube_id')
        this.channels = channels
      }
    },
    route() {
      this.getVideos()
      this.getChannels()
    }
  },
  created() {
    this.route()
  },
  watch: {
    $route() {
      if (this.$route.name === 'youtube-browse') {
        this.route()
      }
    }
  }
}
</script>
