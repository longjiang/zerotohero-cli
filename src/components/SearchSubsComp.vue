<template>
  <div :class="{ 'search-subs': true, fullscreen }">
    <div class="text-center mt-3 mb-3" v-if="checking">Checking content...</div>
    <div class="text-center mt-3 mb-3" v-if="!checking && hits.length === 0">
      No hits.
    </div>
    <div class="mt-3 text-center" v-if="hits.length > 0">
      <span
        class="mr-2 d-inline-block"
        style="position: relative; bottom: 3px"
      >
        <strong :data-level="level">{{ terms[0] }}</strong>
      </span>
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
            @click.stop="goToHitIndex(index)"
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
                v-if="hit.lineIndex > 0"
                v-html="hit.video.subs_l2[Number(hit.lineIndex) - 1].line"
                style="margin-right: 0.5em; opacity: 0.5"
              ></span
              ><span
                v-html="
                  Helper.highlightMultiple(
                    hit.video.subs_l2[Number(hit.lineIndex)].line,
                    terms.map((term) => term),
                    level
                  )
                "
                class="font-weight-bold"
              ></span
              ><span
                v-if="hit.lineIndex < hit.video.subs_l2.length - 1"
                v-html="hit.video.subs_l2[Number(hit.lineIndex) + 1].line"
                style="margin-left: 0.5em; opacity: 0.5"
              ></span></Annotate
          ></b-dropdown-item>
        </template>
      </b-dropdown>
      <b-button @click="previousLine" class="btn btn-small"
        ><i class="fa fa-backward"
      /></b-button>
      <b-button @click="rewind" class="btn btn-small"
        ><i class="fa fa-undo"
      /></b-button>
      <b-button @click="nextLine" class="btn btn-small"
        ><i class="fa fa-forward"
      /></b-button>
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
import Helper from '@/lib/helper'
import YouTube from '@/lib/youtube'

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
      contextLeft: [],
      contextRight: [],
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
  async mounted() {
    this.checking
    if (this.$l2.code === 'zh' && this.terms[0].length === 1) {
      this.excludeTerms = await (await this.$dictionary).getWordsWithCharacter(this.terms[0])
    }
    this.hits = await YouTube.searchSubs(
      this.terms,
      this.excludeTerms,
      this.$l2.code,
      this.$l2.id,
      this.$settings.adminMode
    )
    this.collectContext()
    this.$emit('loaded', this.hits)
    this.checking = false
    this.bindKeys()
  },
  activated() {
    setTimeout(() => {
      if (this.$refs.youtube) this.$refs.youtube.pause()
    }, 800)
  },
  unmounted() {
    this.unbindKeys()
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
    collectContext() {
      let contextLeft = []
      let contextRight = []
      for (let hit of this.hits) {
        contextLeft.push(hit.leftContext)
        contextRight.push(hit.rightContext)
      }
      this.contextLeft = Helper.unique(contextLeft).sort((a, b) =>
        a.localeCompare(b, 'zh-CN')
      )
      this.contextRight = Helper.unique(contextRight).sort((a, b) =>
        a.localeCompare(b, 'zh-CN')
      )
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
    goToHit(hit) {
      let index = this.hits.findIndex(h => h === hit)
      this.hitIndex = index
      this.navigated = true
    },
    goToHitIndex(hitIndex) {
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
      if (this.hits.length > 0) this.fullscreen = !this.fullscreen
    },
    bindKeys() {
      document.addEventListener('keydown', this.keydown)
    },
    unbindKeys() {
      document.removeEventListener('keydown', this.keydown)
    },
    keydown(e) {
      if (e.target.tagName.toUpperCase() !== 'INPUT' && !e.metaKey) {
        // left = 37
        if (e.keyCode == 37) {
          this.prevHit()
          e.preventDefault()
          return false
        }
        // right = 39
        if (e.keyCode == 39) {
          this.nextHit()
          e.preventDefault()
          return false
        }
        // up = 38
        if (e.keyCode == 38) {
          this.previousLine()
          e.preventDefault()
          return false
        }
        // down = 40
        if (e.keyCode == 40) {
          this.nextLine()
          e.preventDefault()
          return false
        }
        // r = 82
        if (e.keyCode == 82) {
          this.rewind()
          e.preventDefault()
          return false
        }
        // spacebar = 32
        if (e.keyCode == 32) {
          this.togglePaused()
          e.preventDefault()
          return false
        }
        // f = 70
        if (e.keyCode == 70) {
          this.toggleFullscreen()
          e.preventDefault()
          return false
        }
        // escape = 27
        if (e.keyCode == 27) {
          this.fullscreen = false
          e.preventDefault()
          return false
        }
      }
    },
  },
}
</script>
<style lang="scss">
.search-subs.fullscreen .video-area {
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
  margin-top: 0 !important;
}
.search-subs .playlist-dropdown {
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
