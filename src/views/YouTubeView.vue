<template>
  <div class="youtube-view main pt-3 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <SimpleSearch
            class="mb-5"
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
      <div class="row">
        <div class="col-sm-12">
          <h3 :key="title">
            <Annotate :showTranslate="true">
              <span>{{ title }}</span>
            </Annotate>
          </h3>
          <template v-if="!loading && hasSubtitles">
            <b-button v-if="!saved" @click="save">Save video</b-button>
            <b-button v-else variant="success">
              <i class="fa fa-check mr-2"></i>Saved
            </b-button>
          </template>
          <template v-if="saved">
            <b-dropdown
              id="dropdown-1"
              :text="saved.topic ? topics[saved.topic] : 'Choose topic'"
              :variant="saved.topic ? 'success' : undefined"
              class="ml-1"
            >
              <b-dropdown-item
                v-for="(title, slug) in topics"
                @click="changeTopic(slug)"
                >{{ title }}</b-dropdown-item
              >
            </b-dropdown>
            <b-dropdown
              id="dropdown-1"
              :text="saved.level ? levels[saved.level] : 'Level'"
              :variant="saved.level ? 'success' : undefined"
              class="ml-1"
            >
              <b-dropdown-item
                v-for="(title, slug) in levels"
                @click="changeLevel(slug)"
                >{{ title }}</b-dropdown-item
              >
            </b-dropdown>
            <b-button variant="danger" @click="remove" class="ml-1"
              ><i class="fas fa-trash-alt"></i
            ></b-button>
          </template>
          <hr class="mt-3" />
          <YouTubeChannelCard v-if="channel" :channel="channel" class="mb-4" />
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6 sticky">
          <div class="sticky pt-3 pb-3 bg-white" :key="'youtube-' + args">
            <YouTubeVideo ref="youtube" :youtube="args" />
          </div>
        </div>
        <div class="col-md-6" :key="'transcript-' + args">
          <div v-if="loading" class="text-center">
            <Loader :sticky="true" />
          </div>
          <SyncedTranscript
            ref="transcript"
            :onSeek="seekYouTube"
            :lines="this.l2Lines"
            :parallellines="this.l1Lines"
            v-else-if="!loading && hasSubtitles"
          />
          <div
            v-else-if="!loading && !hasSubtitles"
            class="jumbotron pt-4 pb-3 bg-light"
          >
            <h6>
              Sorry, this YouTube video does not have {{ $l2.name }} closed
              captions.
            </h6>
            <p>
              You can tell if a YouTube video has closed captions by clicking on
              the
              <b>CC</b> icon in the player bar, and click on the
              <i class="fas fa-cog"></i>next to it. If you can find the subtitle
              with the language
              <b>{{ $l2.name }}</b>
              then the video has {{ $l2.name }}
              subtitles.
            </p>
            <p>
              To look for videos with t{{ $l2.name }} subtitles, search with a
              {{ $l2.name }}
              keyword, and click
              <b>Filter</b>, then <b>CC</b>.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <h4 class="mt-5 mb-4">
            {{ $t('Search for more videos on YouTube') }}
          </h4>
          <SimpleSearch
            class="mb-3"
            :placeholder="
              $t('Enter a search term in {l2}...', { l2: $l2.name })
            "
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
          <p class="mb-5">
            We will try our best to find YouTube videos with
            {{ $l2.name }} subtitles.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeVideo from '@/components/YouTubeVideo'
import SyncedTranscript from '@/components/SyncedTranscript'
import YouTubeChannelCard from '@/components/YouTubeChannelCard'
import SimpleSearch from '@/components/SimpleSearch'
import YouTube from '@/lib/youtube'
import Helper from '@/lib/helper'
import Config from '@/lib/config'

export default {
  components: {
    SimpleSearch,
    YouTubeVideo,
    YouTubeChannelCard,
    SyncedTranscript
  },
  props: {
    args: {
      type: String
    }
  },
  watch: {
    args() {
      this.getSaved()
      this.getVideoDetails()
      this.getTranscript()
      this.$refs.search.url = `https://www.youtube.com/watch?v=${this.args}`
    }
  },
  data() {
    return {
      l1Lines: [],
      l2Lines: [],
      title: undefined,
      channel: undefined,
      hasSubtitles: false,
      loading: true,
      l2Locale: undefined,
      saved: undefined,
      levels: Helper.levels(this.$l2),
      topics: Helper.topics
    }
  },
  methods: {
    seekYouTube(starttime) {
      this.$refs.youtube.seek(starttime)
    },
    async getVideoDetails() {
      this.title = undefined
      this.channel = undefined
      let video = await YouTube.videoByApi(this.args)
      if (video) {
        this.title = video.title
        this.channel = video.channel
        document.title = `${this.title} | ${this.channel.title}`
      }
    },
    async getL2Transcript() {
      const promises = []
      let locales = [this.$l2.code]
      if (this.$l2.locales) {
        locales = locales.concat(this.$l2.locales)
      }
      for (let locale of locales) {
        promises.push(
          Helper.scrape2(
            `https://www.youtube.com/api/timedtext?v=${this.args}&lang=${locale}&fmt=srv3`
          ).then($html => {
            if ($html) {
              this.l2Locale = locale
              for (let p of $html.find('p')) {
                let line = {
                  line: $(p).text(),
                  starttime: parseInt($(p).attr('t')) / 1000
                }
                this.l2Lines.push(line)
              }
            }
          })
        )
      }
      let values = await Promise.all(promises)
    },
    async save() {
      let response = await $.post(`${Config.wiki}items/youtube_videos`, {
        youtube_id: this.args,
        title: this.title,
        l2: this.$l2.id
      })
      if (response) {
        this.saved = response.data
      }
    },
    async getL1Transcript() {
      await Helper.scrape(
        `https://www.youtube.com/api/timedtext?v=${this.args}&lang=${this.l2Locale}&fmt=srv3&tlang=${this.$l1.code}`,
        $html => {
          for (let p of $html.find('p')) {
            let line = {
              line: $(p).text(),
              starttime: parseInt($(p).attr('t')) / 1000
            }
            this.l1Lines.push(line)
          }
        }
      )
      this.hasSubtitles = true
    },
    async getTranscript() {
      this.l1Lines = []
      this.l2Lines = []
      this.hasSubtitles = false
      this.loading = true
      await this.getL2Transcript()
      if (this.l2Lines.length > 0) {
        await this.getL1Transcript()
      }
      this.loading = false
    },
    async getSaved() {
      this.saved = undefined
      let response = await $.getJSON(
        `${Config.wiki}items/youtube_videos?filter[youtube_id][eq]=${this.args}&filter[l2][eq]=${this.$l2.id}`
      )
      if (response && response.data && response.data.length > 0) {
        this.saved = response.data[0]
      }
    },
    async changeLevel(slug) {
      let response = await $.ajax({
        url: `${Config.wiki}items/youtube_videos/${this.saved.id}`,
        data: JSON.stringify({ level: slug }),
        type: 'PATCH',
        contentType: 'application/json',
        xhr: function() {
          return window.XMLHttpRequest == null ||
            new window.XMLHttpRequest().addEventListener == null
            ? new window.ActiveXObject('Microsoft.XMLHTTP')
            : $.ajaxSettings.xhr()
        }
      })
      if (response && response.data) {
        this.saved = response.data
      }
    },
    async changeTopic(slug) {
      let response = await $.ajax({
        url: `${Config.wiki}items/youtube_videos/${this.saved.id}`,
        data: JSON.stringify({ topic: slug }),
        type: 'PATCH',
        contentType: 'application/json',
        xhr: function() {
          return window.XMLHttpRequest == null ||
            new window.XMLHttpRequest().addEventListener == null
            ? new window.ActiveXObject('Microsoft.XMLHTTP')
            : $.ajaxSettings.xhr()
        }
      })
      if (response && response.data) {
        this.saved = response.data
      }
    },
    async remove() {
      let response = await $.ajax({
        url: `${Config.wiki}items/youtube_videos/${this.saved.id}`,
        type: 'DELETE',
        contentType: 'application/json',
        xhr: function() {
          return window.XMLHttpRequest == null ||
            new window.XMLHttpRequest().addEventListener == null
            ? new window.ActiveXObject('Microsoft.XMLHTTP')
            : $.ajaxSettings.xhr()
        }
      })
      if (response) {
        this.saved = undefined
      }
    },
    bindSpacebar() {
      window.onkeydown = e => {
        if (e.keyCode == 32) {
          // e.stopPropagation()
          // e.preventDefault()
          this.$refs.youtube.togglePaused()
          return false
        }
      }
    },
    unbindSpacebar() {
      window.onkeydown = null
    }
  },
  mounted() {
    this.getSaved()
    this.getVideoDetails()
    this.getTranscript()
    this.bindSpacebar()
    this.$refs.search.url = `https://www.youtube.com/watch?v=${this.args}`
    setInterval(() => {
      if (this.$refs.transcript) {
        this.$refs.transcript.currentTime = this.$refs.youtube
          ? this.$refs.youtube.currentTime()
          : 0
      }
    }, 1000)
  },
  deactivated() {
    this.unbindSpacebar()
  }
}
</script>
