<template>
  <div :class="{ 'search-subs': true, fullscreen }">
    <div class="text-center mt-3 mb-3" v-if="checking">Checking content...</div>
    <div class="text-center mt-3 mb-3" v-if="!checking && hits.length === 0">
      No hits.
    </div>
    <div class="mt-3 text-center" v-if="hits.length > 0">
      <span
        v-if="fullscreen"
        class="mr-2 d-inline-block"
        style="position: relative; bottom: 3px"
      >
        <strong :data-level="level">{{ terms[0] }}</strong>
        <small class="ml-1 d-none" style="color: #999">in TV shows</small>
      </span>
      <b-button @click="previousLine" class="btn btn-small"
        ><i class="fa fa-backward"
      /></b-button>
      <b-button @click="rewind" class="btn btn-small"
        ><i class="fa fa-undo"
      /></b-button>
      <b-button @click="nextLine" class="btn btn-small"
        ><i class="fa fa-forward"
      /></b-button>
      <button
        :disabled="hitIndex === 0"
        @click="prevHit"
        :class="{ btn: true, 'btn-small': true, invisible: hitIndex === 0 }"
      >
        <i class="fa fa-chevron-left" />
      </button>
      <span class="ml-0 btn-small mr-0" style="background: none"
        >{{ hitIndex + 1 }} of {{ hits.length }}</span
      >
      <button
        :disabled="hitIndex >= hits.length - 1"
        @click="nextHit"
        :class="{
          btn: true,
          'btn-small': true,
          invisible: hitIndex >= hits.length - 1,
        }"
      >
        <i class="fa fa-chevron-right" />
      </button>
      <b-dropdown
        class="m-md-2 primary playlist-dropdown"
        toggle-class="playlist-dropdown-toggle"
        boundary="viewport"
        no-caret
      >
        <template #button-content><i class="fa fa-stream" /></template>
        <b-dropdown-item
          ><button class="btn btn-small" @click.stop="sortContextLeft">
            Sort Left</button
          ><button class="btn btn-small" @click.stop="sortContextRight">
            Sort Right
          </button></b-dropdown-item
        >
        <template v-for="(hit, index) in hits">
          <b-dropdown-item
            @click.stop="goToHit(index)"
            :class="{ current: index === hitIndex }"
            :key="`dropdown-line-${index}`"
          >
            <Annotate
              :phonetics="false"
              :popup="false"
              :key="`dropdown-line-${index}-annotate-${
                hit.video.subs_l2[Number(hit.lineIndex)].line
              }`"
              ><span
                v-html="
                  Helper.highlightMultiple(
                    hit.video.subs_l2[Number(hit.lineIndex)].line,
                    terms,
                    level
                  )
                "
              ></span></Annotate
          ></b-dropdown-item>
        </template>
      </b-dropdown>
      <input
        type="text"
        v-model.lazy="excludeStr"
        :style="`width: 6em`"
        placeholder="Exclude..."
        class="ml-1 mr-1 btn-small"
      />
      <router-link
        :to="`/${$l1.code}/${$l2.code}/youtube/view/${hits[hitIndex].video.youtube_id}/`"
        class="btn btn-small"
        ><i class="fa fa-window-restore"
      /></router-link>
      <b-button
        class="btn btn-small search-subs-fullscreen"
        @click="toggleFullscreen"
        v-if="!fullscreen"
      >
        <i class="fas fa-expand"></i>
      </b-button>
      <b-button
        class="btn btn-small search-subs-close"
        @click="toggleFullscreen"
        v-if="fullscreen"
      >
        <i class="fas fa-times" />
      </b-button>
    </div>
    <div v-if="hits.length > 0" :set="(hit = hits[hitIndex])" class="mb-4">
      <YouTubeWithTranscript
        :youtube="hit.video.youtube_id"
        ref="youtube"
        :l2Lines="hit.video.subs_l2"
        layout="vertical"
        :highlight="terms"
        :hsk="level"
        :startLineIndex="startLineIndex(hit)"
        :stopLineIndex="Number(hit.lineIndex)"
        :autoload="Helper.iOS() || navigated"
        :autoplay="navigated"
      />
    </div>
    <!--
    <p class="mt-1 text-center" v-if="youglishLang[$l2.code]">
      See examples of “{{ terms[0] }}” on
      <a
        :href="`https://youglish.com/pronounce/${terms[0]}/${
          youglishLang[$l2.code]
        }`"
        target="youglish"
        >YouGlish</a
      >
    </p>
    -->
  </div>
</template>

<script>
import YouTubeWithTranscript from '@/components/YouTubeWithTranscript'
import SyncedTranscript from '@/components/SyncedTranscript'
import SimpleSearch from '@/components/SimpleSearch'
import Config from '@/lib/config'
import shuffle from 'shuffle-array'
import Helper from '@/lib/helper'

export default {
  components: {
    SimpleSearch,
    YouTubeWithTranscript,
    SyncedTranscript,
  },
  props: {
    terms: {
      type: Array,
    },
    level: {
      type: String,
    },
  },
  data() {
    return {
      hits: [],
      excludeTerms: [],
      hitIndex: 0,
      navigated: false,
      checking: true,
      videos: [],
      Helper,
      fullscreen: false,
      excludeStr: '',
      excludeArr: [],
      youglishLang: {
        zh: 'chinese',
        en: 'english',
        ar: 'arabic',
        nl: 'dutch',
        fr: 'french',
        de: 'german',
        he: 'hebrew',
        it: 'italian',
        ja: 'japanese',
        ko: 'korean',
        pl: 'polish',
        pt: 'portuguese',
        ru: 'russian',
        es: 'spanish',
        tr: 'turkish',
      },
    }
  },
  mounted() {
    this.searchSubs()
  },
  activated() {
    setTimeout(() => {
      this.$refs.youtube.pause()
    }, 800)
  },

  watch: {
    excludeStr() {
      this.excludeArr = this.excludeStr.split(',')
      let hits = []
      for (let hit of this.hits) {
        let regex = new RegExp(this.excludeArr.join('|'))
        if (
          !regex.test(hit.video.subs_l2[hit.lineIndex].line) &&
          !regex.test(hit.video.title)
        ) {
          hits.push(hit)
        }
      }
      this.hitIndex = 0
      this.hits = hits
    },
  },
  methods: {
    startLineIndex(hit) {
      return hit.lineIndex
    },
    sortContextLeft() {
      this.hits = this.hits.sort((a, b) =>
        a.leftContext.localeCompare(b.leftContext, 'zh-CN')
      )
    },
    sortContextRight() {
      this.hits = this.hits.sort((a, b) =>
        a.rightContext.localeCompare(b.rightContext, 'zh-CN')
      )
    },
    previousLine() {
      this.$refs.youtube.previousLine()
    },
    nextLine() {
      this.$refs.youtube.nextLine()
    },
    rewind() {
      this.$refs.youtube.rewind()
    },
    async remove() {
      let id = this.hits[this.hitIndex].video.id
      let response = await $.ajax({
        url: `${Config.wiki}items/youtube_videos/${id}`,
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
        this.hits = this.hits.filter((hit) => hit.video.id !== id)
      }
    },
    prevHit() {
      this.hitIndex = Math.max(this.hitIndex - 1, 0)
      this.navigated = true
    },
    nextHit() {
      this.hitIndex = Math.min(this.hitIndex + 1, this.hits.length - 1)
      this.navigated = true
    },
    goToHit(hitIndex) {
      this.hitIndex = hitIndex
      this.navigated = true
      setTimeout(() => {
        document.activeElement.blur()
      }, 100)
    },
    seekYouTube(starttime) {
      this.$refs.youtube.seek(starttime)
    },
    pauseYouTube() {
      this.$refs.youtube.pause()
    },
    playYouTube() {
      this.$refs.youtube.play()
    },
    togglePaused() {
      if (this.$refs.youtube) this.$refs.youtube.togglePaused()
    },
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen
    },
    async searchSubs() {
      this.hits = []
      this.videos = []
      this.checking = true
      if (this.$l2.code === 'zh' && this.terms[0].length === 1) {
        let words = await (await this.$dictionary).lookupFuzzySimple(
          this.terms[0]
        )
        let excludedWords = words.filter((word) => word.simplified.length > 1)
        this.excludeTerms = Helper.unique(
          excludedWords
            .map((word) => word.simplified)
            .concat(excludedWords.map((word) => word.traditional))
        )
      }
      let channelFilter = ''
      let approvedChannels = Config.approvedChannels[this.$l2.code]
      if (approvedChannels) {
        channelFilter = `&filter[channel_id][in]=${approvedChannels.join(',')}`
      }
      let promises = []
      for (let term of this.terms) {
        promises.push(
          $.getJSON(
            `${
              Config.wiki
            }items/youtube_videos?filter[subs_l2][contains]=${term}${channelFilter}&filter[l2][eq]=${
              this.$l2.id
            }&fields=id,youtube_id,l2,title,level,topic,lesson,subs_l2&timestamp=${
              this.$settings.adminMode ? Date.now() : 0
            }`
          ).then((response) => {
            if (response && response.data && response.data.length > 0) {
              this.videos = this.videos.concat(response.data)
            }
          })
        )
      }
      await Promise.all(promises)
      if (approvedChannels && this.videos.length < 3) {
        promises = []
        channelFilter = `&filter[channel_id][in]=${Config.talkChannels[
          this.$l2.code
        ].join(',')}`
        for (let term of this.terms) {
          promises.push(
            $.getJSON(
              `${
                Config.wiki
              }items/youtube_videos?filter[subs_l2][contains]=${term}${channelFilter}&filter[l2][eq]=${
                this.$l2.id
              }&fields=id,youtube_id,l2,title,level,topic,lesson,subs_l2&timestamp=${
                this.$settings.adminMode ? Date.now() : 0
              }`
            ).then((response) => {
              if (response && response.data && response.data.length > 0) {
                this.videos = this.videos.concat(response.data)
              }
            })
          )
        }
        await Promise.all(promises)
      }
      this.hits = this.getHits()
      this.$emit('loaded', this.hits)
      this.checking = false
    },
    getHits() {
      let seenYouTubeIds = []
      let hits = []
      for (let video of this.videos) {
        if (!seenYouTubeIds.includes(video.youtube_id)) {
          seenYouTubeIds.push(video.youtube_id)
          video.subs_l2 = JSON.parse(video.subs_l2).filter(
            (line) => line.starttime
          )
          for (let index in video.subs_l2) {
            if (
              new RegExp(this.terms.join('|')).test(
                video.subs_l2[index].line
              ) &&
              (this.excludeTerms.length === 0 ||
                !new RegExp(this.excludeTerms.join('|')).test(
                  video.subs_l2[index].line
                ))
            ) {
              hits.push({
                video: video,
                lineIndex: index,
              })
            }
          }
        }
      }
      // hits = this.mergeLines(hits) // merge previous line or next line if very short
      for (let hit of hits) {
        if (!hit.leftContext) {
          let line =
            (hit.lineIndex > 0
              ? hit.video.subs_l2[hit.lineIndex - 1].line
              : '') + hit.video.subs_l2[hit.lineIndex].line
          let regex = new RegExp(`(${this.terms.join('|')}).*`)
          hit.leftContext = line.replace(regex, '').split('').reverse().join('')
        }
        if (!hit.rightContext) {
          let line = hit.video.subs_l2[hit.lineIndex].line
          let regex = new RegExp(`.*(${this.terms.join('|')})`)
          hit.rightContext = line.replace(regex, '')
        }
      }
      return hits.sort((a, b) =>
        a.rightContext.localeCompare(b.rightContext, 'zh-CN')
      )
    },
    mergeLines(hits) {
      for (let hit of hits) {
        if (
          hit.video.subs_l2[hit.lineIndex] &&
          hit.video.subs_l2[hit.lineIndex - 1]
        ) {
          if (
            hit.video.subs_l2[hit.lineIndex].starttime -
              hit.video.subs_l2[hit.lineIndex - 1].starttime <
            5
          ) {
            hit.video.subs_l2[hit.lineIndex - 1].line =
              hit.video.subs_l2[hit.lineIndex - 1].line +
              ' ' +
              hit.video.subs_l2[hit.lineIndex].line
            hit.video.subs_l2.splice(hit.lineIndex - 1, 1)
            hit.lineIndex = hit.lineIndex - 1
          }
        }
        if (
          hit.video.subs_l2[hit.lineIndex] &&
          hit.video.subs_l2[hit.lineIndex + 1]
        ) {
          if (
            hit.video.subs_l2[hit.lineIndex + 1].starttime -
              hit.video.subs_l2[hit.lineIndex].starttime <
            5
          ) {
            hit.video.subs_l2[hit.lineIndex].line =
              hit.video.subs_l2[hit.lineIndex].line +
              ' ' +
              hit.video.subs_l2[hit.lineIndex + 1].line
            hit.video.subs_l2.splice(hit.lineIndex + 1, 1)
          }
        }
      }
      return hits
    },
  },
}
</script>
<style scoped lang="scss">
.fullscreen >>> .video-area {
  background: black;
}
.search-subs.fullscreen {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  z-index: 10;
  overflow: scroll;
}
.search-subs >>> .playlist-dropdown {
  .playlist-dropdown-toggle {
    color: #a7a7a7;
    font-size: 0.8rem;
    padding: 0.1rem 0.4rem;
    border-radius: 0.2rem;
    background: #f3f3f3;
    position: relative;
    margin: 0.2rem;
    display: inline-block;
    bottom: 0.2rem;
    border: none;
    &:hover {
      background-color: #b5b5b5;
      text-decoration: none;
      color: #868686;
    }
  }
  .dropdown-menu {
    margin-top: 2.2rem;
    height: calc(100vh - 3rem);
    border: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    overflow: scroll;
    .current {
      .dropdown-item {
        background: #f3f3f3;
      }
    }
    .dropdown-item {
      max-width: 98vw;
      white-space: normal;
      padding: 0.25rem 1rem;
      color: #666;
      &:hover {
        background-color: #f3f3f3;
        cursor: pointer;
      }
    }
  }
}
</style>
