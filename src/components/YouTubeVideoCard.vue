<template>
  <drop
    @drop="handleDrop"
    :class="{
      over: video.over,
      'youtube-video': true,
      media: true,
      rounded: true,
      shadow: true,
      nosubs: checkSubs && !video.checkingSubs && !video.hasSubs,
      drop: checkSubs && !video.checkingSubs && !video.hasSubs,
    }"
    @dragover="video.over = true"
    @dragleave="video.over = false"
  >
    <div class="youtube-link">
      <router-link
        v-if="video.thumbnail"
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
        <div v-if="video.hasSubs" class="btn btn-small mt-2 ml-0">
          {{ $l2.name }} CC
          <span v-if="video.locale">({{ video.locale }})</span>
        </div>
        <div
          v-if="video.checkingSubs === false && video.hasSubs === false"
          class="btn btn-small mt-2 ml-0"
        >
          No {{ $l2.name }} CC
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
import { Drag, Drop } from 'vue-drag-drop'

export default {
  components: {
    Drag,
    Drop,
  },
  data() {
    return {
      Helper,
      videoInfoKey: 0
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
      const files = event.dataTransfer.files
      const filenames = []
      for (let i = 0; i < files.length; i++) {
        filenames.push(files.item(i).name)
      }
      alert(`You dropped files: ${JSON.stringify(filenames)}`)
    },
    async getSubsAndSave(video) {
      await this.getL2Transcript(video)
      await this.save(video)
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
  border-color: #aaa;
  background: #ccc;
}
.youtube-video {
  min-width: 15rem;
  max-width: 20rem;
  flex: 1;
  margin: 1rem;
}

.youtube-video.nosubs {
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
