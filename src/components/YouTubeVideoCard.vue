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
      <div class="media-body" :key="`video-${video.youtube_id}-${videoInfoKey}`">
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
          <span v-if="video.locale">({{ video.locale }})</span>
        </div>
        <div
          v-if="video.checkingSubs === false && video.hasSubs === false && !video.id"
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
      over: false
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
    }
  },
  mounted() {
    if (this.checkSubs) {
      this.checkSubsFunc(this.video)
    }
  },
  methods: {
    handleDrop(data, event) {
      event.preventDefault()
      let file = event.dataTransfer.files[0]
      let reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (event) => {
        let srt = event.target.result
        this.video.subs_l2 = parseSync(srt).map(cue => {
          return {
            starttime: cue.data.start/1000,
            line: cue.data.text
          }
        })
        this.video.hasSubs = true
        this.videoInfoKey++
      }
    },
    async addChannelID(video) {
      let channelId = await this.getChannelID(video)
      console.log(channelId)
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
      if (!video.subs_l2) await this.getL2Transcript(video)
      if (!video.channel_id) await this.getChannelID(video)
      await this.save(video)
    },
    async getChannelID(video) {
      let details = await YouTube.videoByApi(video.youtube_id)
      return details.channel.id
    },
    async getL2Transcript(video) {
      if (video.locale) {
        await Helper.scrape2(
          `https://www.youtube.com/api/timedtext?v=${video.youtube_id}&lang=${video.locale}&fmt=srv3`
        ).then(($html) => {
          if ($html) {
            let lines = []
            for (let p of $html.find('p')) {
              let line = {
                line: $(p).text(),
                starttime: parseInt($(p).attr('t')) / 1000,
              }
              lines.push(line)
            }
            video.subs_l2 = lines.filter((line) => line.line.trim() !== '')
          }
        })
        return true
      }
    },
    async save(video) {
      let response = await $.post(`${Config.wiki}items/youtube_videos`, {
        youtube_id: video.youtube_id,
        title: video.title,
        l2: this.$l2.id,
        subs_l2: JSON.stringify(video.subs_l2),
        channel_id: video.channel_id
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
        }&filter[l2][eq]=${this.$l2.id}`
      )
      if (response && response.data.length > 0) {
        video.id = response.data[0].id
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
        let locales = this.$l2.code === 'zh' ? [] : [this.$l2.code]
        if (this.$l2.locales) {
          locales = locales.concat(this.$l2.locales)
        }
        Helper.scrape2(
          `https://www.youtube.com/api/timedtext?v=${video.youtube_id}&type=list`
        ).then(($html) => {
          for (let track of $html.find('track')) {
            let locale = $(track).attr('lang_code')
            if (locales.includes(locale)) {
              video.hasSubs = true
              video.checkingSubs = false
              video.locale = locale
            }
          }
          this.videoInfoKey++
        })
        video.checkingSubs = false
        if (this.checkSaved) {
          await this.checkSavedFunc(video)
        }
      }
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
