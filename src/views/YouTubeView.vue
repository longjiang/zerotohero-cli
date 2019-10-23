<template>
  <div class="youtube-view main pt-5 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <YouTubeNav class="mb-5" ref="search" />
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
            <button class="btn btn-default" v-if="saved.length === 0" @click="save">Save video</button>
            <button class="btn btn-primary" v-if="saved.length > 0">Saved</button>
          </template>
          <hr class="mt-3" />
          <YouTubeChannelCard v-if="channel" :channel="channel" class="mb-5" />
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
          <div v-else-if="!loading && !hasSubtitles" class="jumbotron pt-4 pb-3 bg-light">
            <h6>Sorry, this YouTube video does not have {{ $l2.name }} closed captions.</h6>
            <p>
              You can tell if a YouTube video has closed captions by clicking on
              the
              <b>CC</b> icon in the player bar, and click on the
              <i class="fas fa-cog"></i>next to it. If you can find the
              subtitle with the language
              <b>{{ $l2.name }}</b>
              then the video has {{ $l2.name }}
              subtitles.
            </p>
            <p>
              To look for videos with t{{ $l2.name }} subtitles, search with a {{ $l2.name }}
              keyword, and click
              <b>Filter</b>, then
              <b>CC</b>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeVideo from '@/components/YouTubeVideo'
import SyncedTranscript from '@/components/SyncedTranscript'
import YouTubeNav from '@/components/YouTubeNav'
import YouTubeChannelCard from '@/components/YouTubeChannelCard'
import Helper from '@/lib/helper'
import Config from '@/lib/config'

export default {
  components: {
    YouTubeNav,
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
      saved: []
    }
  },
  methods: {
    seekYouTube(starttime) {
      this.$refs.youtube.seek(starttime)
    },
    getVideoDetails() {
      this.title = undefined
      this.channel = undefined
      Helper.scrape(`https://www.youtube.com/watch?v=${this.args}`, $html => {
        this.title = $html.find('#eow-title').attr('title')
        this.channel = {
          id: $html.find('meta[itemprop="channelId"]').attr('content'),
          avatar: $html.find('#watch7-user-header img').attr('data-thumb'),
          title: $html
            .find('#watch7-user-header .yt-uix-sessionlink')
            .text()
            .trim()
        }
      })
    },
    async getL2Transcript() {
      const promises = []
      let locales = [this.$l2.code]
      if (this.$l2.locales) {
        locales = locales.concat(this.$l2.locales)
      }
      for (let locale of locales) {
        promises.push(
          Helper.scrape(
            `https://www.youtube.com/api/timedtext?v=${this.args}&lang=${locale}&fmt=srv3`,
            $html => {
              this.l2Locale = locale
              for (let p of $html.find('p')) {
                let line = {
                  line: $(p).text(),
                  starttime: parseInt($(p).attr('t')) / 1000
                }
                this.l2Lines.push(line)
              }
            }
          )
        )
      }
      await Promise.all(promises)
    },
    async save() {
      let success = await $.post(`${Config.wiki}items/youtube_videos`, {
        youtube_id: this.args,
        title: this.title,
        l2: this.$l2.id
      })
      if (success) {
        this.saved = [{
          id: success.data.youtube_id,
          title: success.data.title
        }]
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
      this.saved = []
      this.saved = (await $.getJSON(
        `${Config.wiki}items/youtube_videos?filter[youtube_id][eq]=${this.args}`
      )).data.map(video => {
        return {
          id: video.youtube_id,
          title: video.title
        }
      })
    }
  },
  mounted() {
    this.getSaved()
    this.getVideoDetails()
    this.getTranscript()
    this.$refs.search.url = `https://www.youtube.com/watch?v=${this.args}`
    setInterval(() => {
      if (this.$refs.transcript) {
        this.$refs.transcript.currentTime = this.$refs.youtube
          ? this.$refs.youtube.currentTime()
          : 0
      }
    }, 1000)
  }
}
</script>
