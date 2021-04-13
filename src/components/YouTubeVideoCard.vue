<template>
  <drop
    @drop="handleDrop"
    :class="{
      over: over,
      'youtube-video': true,
      media: true,
      rounded: true,
      shadow: true,
      nosubs: checkSubs && !video.checkingSubs && !video.hasSubs && !video.id,
      drop: checkSubs && !video.checkingSubs && !video.hasSubs,
    }"
    @dragover="over = true"
    @dragleave="over = false"
    :key="`video-${video.youtube_id}-${videoInfoKey}`"
  >
    <div class="youtube-link">
      <router-link
        :to="`/${$l1.code}/${$l2.code}/youtube/view/${video.youtube_id}/${
          video.lesson ? 'lesson' : ''
        }`"
        class="youtube-thumbnail-wrapper aspect-wrapper d-block"
      >
        <img
          :src="
            video.thumbnail ||
            `//img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`
          "
          class="youtube-thumbnail aspect"
        />
      </router-link>
      <div
        class="media-body"
      >
        <b
          ><router-link
            :to="`/${$l1.code}/${$l2.code}/youtube/view/${video.youtube_id}/${
              video.lesson ? 'lesson' : ''
            }`"
            class="youtube-title d-block link-unstyled"
            >{{ video.title }}</router-link
          ></b
        >
        <div v-if="video.hasSubs || video.id" class="btn btn-small mt-2 ml-0">
          {{ $l2.name }} CC
          <span v-if="video.l2Locale">({{ video.l2Locale }})</span>
        </div>
        <div
          v-if="
            video.checkingSubs === false && video.hasSubs === false && !video.id
          "
          class="btn btn-small mt-2 ml-0"
        >
          <span v-if="!over">No {{ $l2.name }} CC</span>
          <span v-else>Drop SRT to Add Subs</span>
        </div>
        <div
          v-if="checkSaved && video.id"
          class="btn btn-small bg-success text-white mt-2 ml-0"
        >
          <i class="fa fa-check mr-2"></i>Added
        </div>
        <b-button
          v-if="checkSaved && !video.id && video.hasSubs"
          class="btn btn-small mt-2 ml-0"
          @click="getSubsAndSave(video)"
          ><i class="fas fa-plus mr-2"></i>Add</b-button
        >
        <!--
        <b-button
          v-if="video.id && !video.channel_id"
          class="btn btn-small mt-2 ml-0"
          @click="addChannelID(video)"
          ><i class="fas fa-plus mr-2"></i>Add Channel ID</b-button
        >
        <b-button
          v-if="video.id"
          class="btn btn-small bg-danger text-white mt-2 ml-0"
          @click="remove(video)"
          ><i class="fa fa-trash"></i></b-button
        >
        -->
        <div
          v-if="video.id && video.topic"
          class="btn btn-small btn-gray mt-2 ml-0"
        >
          {{ Helper.topics[video.topic] }}
        </div>
        <div
          v-if="video.id && video.level"
          class="btn btn-small btn-gray mt-2 ml-0"
        >
          {{ Helper.level(video.level, $l2) }}
        </div>
        <!--
        <div v-if="video.subs_l1 && video.subs_l1.length > 0">
          <div v-for="index in [0,1,2,3,4]"><b>{{ video.l1Locale }} </b><span @click="matchSubsAndUpdate(index)" :class="{'btn': true, 'btn-small': true, 'text-danger': video.subs_l2 && video.subs_l2.length > 0 && video.subs_l1[index].starttime !== video.subs_l2[0].starttime }">{{ video.subs_l1[index].starttime }}</span> {{ video.subs_l1[index].line }}</div>
        </div>
        <div v-if="video.subs_l2 && video.subs_l2.length > 0">
          <b>{{ video.l2Locale || $l2.code }}</b> <input type="text" v-model.lazy="firstLineTime" :style="`width: ${String(firstLineTime).length}em`" class="ml-1 mr-1 btn btn-small" /> {{ video.subs_l2[0].line }}

          <b-button v-if="!subsUpdated" @click="updateSubs" class="mt-2 btn btn-small"
            ><i class="fa fa-save mr-2"></i>Update Subs</b-button
          >
          <b-button v-else variant="success" class="mt-2 btn btn-small">
            <i class="fa fa-check mr-2"></i>Updated
          </b-button>
        </div>
        -->
      </div>
    </div>
  </drop>
</template>

<script>
import Helper from '@/lib/helper'
import Config from '@/lib/config'
import YouTube from '@/lib/youtube'
import { Drag, Drop } from 'vue-drag-drop'
import { parseSync } from 'subtitle'

export default {
  components: {
    Drag,
    Drop,
  },
  data() {
    return {
      Helper,
      videoInfoKey: 0,
      over: false,
      firstLineTime: this.video.subs_l2 && this.video.subs_l2[0] ? this.video.subs_l2[0].starttime : 0,
      subsUpdated: false
    }
  },
  props: {
    checkSaved: {
      default: false,
    },
    video: {
      type: Object,
    },
    checkSubs: {
      default: false,
    },
  },
  mounted() {
    if (this.checkSubs) {
      this.checkSubsFunc(this.video)
    }
  },
  watch: {
    firstLineTime() {
      this.shiftSubs()
    },
  },
  methods: {
    matchSubsAndUpdate(index) {
      this.firstLineTime = this.video.subs_l1[index].starttime
      this.shiftSubs()
      this.updateSubs()
    },
    shiftSubs() {
      if (this.video.subs_l2 && this.video.subs_l2.length > 0 && this.firstLineTime !== this.video.subs_l2[0].starttime) {
        let subsShift =
          Number(this.firstLineTime) - Number(this.video.subs_l2[0].starttime)
        if (subsShift !== 0) {
          for (let line of this.video.subs_l2) {
            line.starttime = Number(line.starttime) + subsShift
          }
        }
      }
    },
    async remove(video) {
      let response = await $.ajax({
        url: `${Config.wiki}items/youtube_videos/${video.id}`,
        type: 'DELETE',
        contentType: 'application/json',
        xhr: function () {
          return window.XMLHttpRequest == null ||
            new window.XMLHttpRequest().addEventListener == null
            ? new window.ActiveXObject('Microsoft.XMLHTTP')
            : $.ajaxSettings.xhr()
        },
      })
      if (response) {
        video.id = undefined
        this.videoInfoKey++
      }
    },
    async updateSubs() {
      let response = await $.ajax({
        url: `${Config.wiki}items/youtube_videos/${this.video.id}`,
        data: JSON.stringify({ subs_l2: JSON.stringify(this.video.subs_l2) }),
        type: 'PATCH',
        contentType: 'application/json',
        xhr: function () {
          return window.XMLHttpRequest == null ||
            new window.XMLHttpRequest().addEventListener == null
            ? new window.ActiveXObject('Microsoft.XMLHTTP')
            : $.ajaxSettings.xhr()
        },
      })
      if (response && response.data) {
        this.subsUpdated = true
      }
    },
    handleDrop(data, event) {
      event.preventDefault()
      let file = event.dataTransfer.files[0]
      let reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (event) => {
        let srt = event.target.result
        this.video.subs_l2 = parseSync(srt).map((cue) => {
          return {
            starttime: cue.data.start / 1000,
            line: cue.data.text,
          }
        })
        console.log('loaded')
        this.firstLineTime = this.video.subs_l2[0].starttime
        this.video.hasSubs = true
        this.videoInfoKey++
      }
    },
    async addChannelID(video) {
      let channelId = await this.getChannelID(video)
      let response = await $.ajax({
        url: `${Config.wiki}items/youtube_videos/${video.id}`,
        data: JSON.stringify({ channel_id: channelId }),
        type: 'PATCH',
        contentType: 'application/json',
        xhr: function () {
          return window.XMLHttpRequest == null ||
            new window.XMLHttpRequest().addEventListener == null
            ? new window.ActiveXObject('Microsoft.XMLHTTP')
            : $.ajaxSettings.xhr()
        },
      })
      if (response && response.data) {
        video.channel_id = response.data.channel_id
        this.videoInfoKey++
      }
    },
    async getSubsAndSave(video) {
      if (!video.subs_l2 && video.l2Locale) {
        video.subs_l2 = await this.getTranscript(video, video.l2Locale)
        this.firstLineTime = video.subs_l2[0].starttime
      }
      if (!video.channel_id) await this.getChannelID(video)
      await this.save(video)
    },
    async getChannelID(video) {
      let details = await YouTube.videoByApi(video.youtube_id)
      video.channel_id = details.channel.id
      return details.channel.id
    },
    async getTranscript(video, locale) {
      let lines = []
      let $html = await Helper.scrape2(
        `https://www.youtube.com/api/timedtext?v=${video.youtube_id}&lang=${locale}&fmt=srv3`
      )
      if ($html) {
        for (let p of $html.find('p')) {
          let line = {
            line: $(p).text(),
            starttime: parseInt($(p).attr('t')) / 1000,
          }
          lines.push(line)
        }
        lines = lines.filter((line) => line.line.trim() !== '')
      }
      return lines
    },
    async save(video) {
      let response = await $.post(`${Config.wiki}items/youtube_videos`, {
        youtube_id: video.youtube_id,
        title: video.title,
        l2: this.$l2.id,
        subs_l2: JSON.stringify(video.subs_l2),
        channel_id: video.channel_id,
      })
      if (response && response.data) {
        video.id = response.data.id
        return true
      }
    },
    async checkSavedFunc(video) {
      let response = await $.getJSON(
        `${Config.wiki}items/youtube_videos?filter[youtube_id][eq]=${
          video.youtube_id
        }&filter[l2][eq]=${this.$l2.id}&timestamp=${Date.now()}`
      )
      if (response && response.data.length > 0) {
        video = Object.assign(video, response.data[0])
        video.subs_l2 = JSON.parse(video.subs_l2)
        this.firstLineTime = video.subs_l2[0].starttime
        this.videoInfoKey++
      }
    },
    async checkSubsFunc(video) {
      video.checkingSubs = true
      video.hasSubs = false
      if (video.subs_l2 && video.subs_l2.length > 0) {
        video.hasSubs = true
        video.checkingSubs = false
        this.videoInfoKey++
      } else {
        await this.getYouTubeSubsList(video)
        if (this.checkSaved) {
          await this.checkSavedFunc(video)
        }
        video.checkingSubs = false
      }
      if(video.id) {
        let subs_l1 = await this.getTranscript(video, video.l1Locale)
        this.video.subs_l1 = subs_l1.filter(line => !/^[♫♪]/.test(line.line))
      }
      this.videoInfoKey++
    },
    async getYouTubeSubsList(video) {
      let l2Locales = this.$l2.code === 'zh' ? [] : [this.$l2.code]
      if (this.$l2.locales) {
        l2Locales = l2Locales.concat(this.$l2.locales)
      }
      let l1Locales = [this.$l1.code]
      if (this.$l1.locales) {
        l1Locales = l1Locales.concat(this.$l1.locales)
      }
      Helper.scrape2(
        `https://www.youtube.com/api/timedtext?v=${video.youtube_id}&type=list`
      ).then(($html) => {
        for (let track of $html.find('track')) {
          let locale = $(track).attr('lang_code')
          if (l2Locales.includes(locale)) {
            video.hasSubs = true
            video.checkingSubs = false
            video.l2Locale = locale
            break
          }
        }
        for (let track of $html.find('track')) {
          let locale = $(track).attr('lang_code')
          if (l1Locales.includes(locale)) {
            video.l1Locale = locale
            break
          }
        }
        this.videoInfoKey++
      })
    },
  },
}
</script>

<style lang="scss">
.youtube-video.drop.over {
  border: 2px dashed #ccc;
}
.youtube-video {
  min-width: 15rem;
  max-width: 20rem;
  flex: 1;
  margin: 1rem;
}

.youtube-video.nosubs:not(.over) {
  opacity: 0.2;
}

a.youtube-link,
a.youtube-link:hover {
  color: #666;
  text-decoration: none;
  .youtube-title {
    font-weight: bold;
  }
}
</style>
