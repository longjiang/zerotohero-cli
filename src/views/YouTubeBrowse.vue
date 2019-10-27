<template>
  <div class="youtube-browse container mt-5 mb-5 main">
    <div class="row">
      <div class="col-sm-12">
        <h1 class="mb-5 text-center">{{ $t('Study YouTube Subtitles') }}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <template v-if="videos && videos.length > 0">
          <h4 class="mt-5 mb-5">{{ $t('Recommended Videos') }}</h4>
          <YouTubeVideoList :videos="videos" />
        </template>
        <template v-if="channels && channels.length > 0">
          <h4 class="mt-5 mb-5">{{ $t('Recommended Channels') }}</h4>
          <ul class="list-unstyled p-0 mb-5 cards">
            <li v-for="channel in channels" class="p-4 mb-4 card">
              <YouTubeChannelCard :channel="channel" />
            </li>
          </ul>
        </template>

      </div>
      <div class="col-sm-12">
        <h4 class="mt-5 mb-4">{{ $t('Search for more videos on YouTube') }}</h4>
        <SimpleSearch
          class="mb-3"
          :placeholder="$t('Enter a search term in {l2}...', { l2: $l2.name })"
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
        <p class="mb-5">We will try our best to find YouTube videos with {{ $l2.name }} subtitles.</p>
        <!--
        <h4 class="mt-5 mb-5">
          {{
            $t('Study any YouTube video that has {l2} subtitles.', {
              l2: $l2.name
            })
          }}
        </h4>
        <div class="jumbotron bg-light pt-4 pb-3 mt-3 mb-3">
          <YouTubeNav class="mb-4" />
          <ol>
            <li>Go to YouTube, search an {{ $l2.name }} word.</li>
            <li>
              Click on
              <b>Filter</b>, and choose
              <b>Subtitles/CC.</b>
            </li>
            <li>
              Open a video that interests you.
              <br />
              <small>
                <b>Note:</b> Many have closed captions, but they are in other
                languages. You need to look for <em>{{ $l2.name }}</em> closed
                captions. These are hard to find. If you cannot find any, look
                in the suggested channels listed on this page.
              </small>
            </li>
            <li>
              Copy the video's URL, paste it into the box above, and press
              <b>Enter</b>
              or click
              <b>Study.</b>
            </li>
          </ol>
        </div>
        -->
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
    }
  },
  data() {
    return {
      location,
      channels: [],
      videos: []
    }
  },
  async mounted() {
    let videos = (await $.getJSON(
      `${Config.wiki}items/youtube_videos?filter[l2][eq]=${this.$l2.id}`
    )).data.map(video => {
      return {
        id: video.youtube_id,
        title: video.title
      }
    })
    videos = Helper.uniqueByValue(videos, 'id')
    this.videos = videos
    let response = await $.getJSON(
      `${Config.wiki}items/youtube_channels?filter[language][eq]=${this.$l2.id}&fields=*,avatar.*`
    )
    if (response.data && response.data.length > 0) {
      let channels = response.data.map(channel => {
        return {
          id: channel.channel_id,
          avatar: channel.avatar.data.full_url,
          title: channel.name,
          description: channel.description
        }
      })
      channels = Helper.uniqueByValue(channels, 'id')
      this.channels = channels
    }
  }
}
</script>
