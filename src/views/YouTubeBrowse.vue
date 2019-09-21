<template>
  <div class="youtube-browse container mt-5 mb-5 main">
    <div class="row">
      <div class="col-sm-12">
        <h1 class="mb-5 text-center">{{$t('Study YouTube Subtitles')}}</h1>
        <h4 class="mt-5 mb-5 text-center">{{ $t('Search YouTube') }}</h4>
        <SimpleSearch
          :placeholder="$t('Enter a search term in English...')"
          :action="
            url => {
              location.hash = `#/${$lang.code}/youtube/search/${encodeURIComponent(url)}`
            }
          "
          ref="search"
          class="mb-5"
        />
        <template v-if="channels && channels.length > 0">
          <h4 class="mt-5 mb-5 text-center">{{ $t('Recommended Channels') }}</h4>
          <ul class="list-unstyled p-0 mb-5 cards">
            <li v-for="channel in channels" class="p-4 mb-4 card">
              <YouTubeChannelCard :channel="channel" />
            </li>
          </ul>
        </template>

        <h4 class="mt-5 mb-5 text-center">
          {{$t('Study any YouTube video that has English subtitles.')}}
        </h4>

        <div class="jumbotron bg-light pt-4 pb-3 mt-3 mb-3">
          <YouTubeNav class="mb-4" />
          <ol>
            <li>
              Go to YouTube, search an English word.
            </li>
            <li>
              Click on
              <b>Filter</b>, and choose
              <b>Subtitles/CC.</b>
            </li>
            <li>
              Open a video that interests you.
              <br />
              <small>
                <b>Note:</b> Many have closed captions, but they are in
                other languages. You need to look for
                <em>English</em> closed
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
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeNav from '@/components/YouTubeNav'
import YouTubeChannelCard from '@/components/YouTubeChannelCard'
import SimpleSearch from '@/components/SimpleSearch'

export default {
  components: {
    YouTubeNav,
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
      channels: this.$lang.options.youtube.channels
    }
  }
}
</script>
