<template>
  <div :class="{ 'compare-search-subs': true, fullscreen }">
    <div v-if="checkingA || checkingB" class="text-center mb-3 mt-3">
      Searching...
    </div>
    <div
      v-if="
        !checkingA && !checkingB && hitsA.length === 0 && hitsB.length === 0
      "
      class="text-center mb-3 mt-3"
    >
      No hits.
    </div>
    <div
      :class="{
        'mt-2': true,
        'text-center': true,
        'search-subs': true,
        'd-none': checkingA || checkingB,
      }"
    >
      <b-button
        class="mr-2 btn btn-small"
        :data-bg-level="hitAB === 'A' ? levelA : false"
        @click="hitAB = 'A'"
        >{{ termsA[0] }}</b-button
      >

      <b-dropdown
        class="primary playlist-dropdown"
        toggle-class="playlist-dropdown-toggle"
        boundary="viewport"
        ref="dropdown"
        no-caret
      >
        <template #button-content
          ><i class="fa fa-stream" /> Compare Hits</template
        >
        <b-dropdown-item class="text-center"
          ><button
            :class="{
              btn: true,
              'btn-small': true,
              'bg-dark': sort === 'left',
              'text-white': sort === 'left',
            }"
            @click.stop="sortContextLeft"
          >
            Sort Left</button
          ><button
            :class="{
              btn: true,
              'btn-small': true,
              'bg-dark': sort === 'right',
              'text-white': sort === 'right',
            }"
            @click.stop="sortContextRight"
          >
            Sort Right
          </button></b-dropdown-item
        >
        <template
          v-for="c in sort === 'right' ? groupIndexRight : groupIndexLeft"
        >
          <div
            :set="
              (theseHits = sort === 'right' ? groupsRight[c] : groupsLeft[c])
            "
            :key="`compare-subs-grouping-${sort}-${c}`"
          >
            <!--
          <b-dropdown-text
            :key="`comp-subs-dropdown-group-header-${c}`"
            class="bg-dark text-white font-weight-bold"
          >
            <div style="display: flex">
              <span style="flex: 1">{{ termsA[0] }}{{ c + '……' }}</span>
              <span style="flex: 1"
                >{{ termsB[0] }}{{ c.length > 0 ? c + '……' : 'ø' }}</span
              >
            </div>
          </b-dropdown-text>
          -->
            <b-dropdown-divider :key="`comp-subs-grouping-${c}-divider`" />
            <b-dropdown-item
              v-for="index in Math.max(theseHits.A.length, theseHits.B.length)"
              :key="`comp-subs-grouping-${c}-${index}`"
              @click="
                theseHits.A[index - 1]
                  ? goToHit('A', theseHits.A[index - 1])
                  : theseHits.B[index - 1]
                  ? goToHit('B', theseHits.B[index - 1])
                  : false
              "
            >
              <div style="display: flex">
                <template v-for="ab in ['A', 'B']">
                  <div
                    :style="`flex: 1; margin-right: ${
                      ab === 'A' ? '1rem' : 0
                    }; display: flex;`"
                    v-if="theseHits[ab][index - 1]"
                    @click.stop.prevent="
                      goToHit(
                        ab,
                        sort === 'right'
                          ? groupsRight[c][ab][index - 1]
                          : groupsLeft[c][ab][index - 1]
                      )
                    "
                    :set="(hit = theseHits[ab][index - 1])"
                    :key="`comp-subs-grouping-${c}-${index}-${ab}-1`"
                  >
                    <div>
                      <img
                        class="hit-thumb"
                        style="margin-top: 0.2rem"
                        v-if="ab === 'A' && hit"
                        :src="`//img.youtube.com/vi/${hit.video.youtube_id}/hqdefault.jpg`"
                        :alt="hit.video.title"
                      />
                    </div>
                    <div style="flex: 1">
                      <Annotate
                        :phonetics="false"
                        :popup="false"
                        :key="`dropdown-line-${index}-annotate-${
                          hit.video.subs_l2[Number(hit.lineIndex)].line
                        }`"
                      >
                        <span
                          v-if="sort === 'left' && hit.lineIndex > 0"
                          v-html="
                            hit.video.subs_l2[Number(hit.lineIndex) - 1].line
                          "
                          style="margin-right: 0.5em; opacity: 0.5"
                        />
                        <span
                          v-html="
                            Helper.highlightMultiple(
                              hit.video.subs_l2[Number(hit.lineIndex)].line,
                              ab === 'A'
                                ? termsA.map((term) => term)
                                : termsB.map((term) => term),
                              ab === 'A' ? levelA : levelB
                            )
                          "
                        />
                        <span
                          v-if="
                            sort === 'right' &&
                            hit.lineIndex < hit.video.subs_l2.length - 1
                          "
                          v-html="
                            hit.video.subs_l2[Number(hit.lineIndex) + 1].line
                          "
                          style="margin-left: 0.5em; opacity: 0.5"
                        ></span>
                      </Annotate>
                    </div>
                    <div style="margin-left: 1rem">
                      <img
                        class="hit-thumb"
                        style="margin-top: 0.2rem"
                        v-if="ab === 'B' && hit"
                        :src="`//img.youtube.com/vi/${hit.video.youtube_id}/hqdefault.jpg`"
                        :alt="hit.video.title"
                      />
                    </div>
                  </div>
                  <div
                    v-if="!theseHits[ab][index - 1]"
                    style="flex: 1; margin-right: 1rem"
                    :key="`comp-subs-grouping-${c}-${index}-${ab}-2`"
                  >
                    &nbsp;
                  </div>
                </template>
              </div>
            </b-dropdown-item>
          </div>
        </template>
      </b-dropdown>
      <b-button
        class="btn btn-small"
        :data-bg-level="hitAB === 'B' ? levelB : false"
        @click="hitAB = 'B'"
        >{{ termsB[0] }}</b-button
      >
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
    <SearchSubsComp
      :class="{ 'd-none': hitAB === 'B' }"
      ref="searchSubsA"
      :level="levelA"
      :terms="termsA"
      :key="`subs-search-${termsA[0]}`"
      @loaded="searchSubsALoaded"
      :keyboard="false"
      :fullscreenToggle="false"
    />
    <SearchSubsComp
      :class="{ 'd-none': hitAB === 'A' }"
      ref="searchSubsB"
      :level="levelB"
      :terms="termsB"
      :key="`subs-search-${termsB[0]}`"
      @loaded="searchSubsBLoaded"
      :keyboard="false"
      :fullscreenToggle="false"
    />
  </div>
</template>

<script>
import SearchSubsComp from '@/components/SearchSubsComp'
import Helper from '@/lib/helper'

export default {
  components: {
    SearchSubsComp,
  },
  props: {
    termsA: {
      type: Array,
    },
    levelA: {
      type: String,
    },
    termsB: {
      type: Array,
    },
    levelB: {
      type: String,
    },
  },
  data() {
    return {
      hitAB: 'A',
      hitIndexA: 0,
      hitIndexB: 0,
      hitsA: [],
      hitsB: [],
      groupsRight: {},
      groupsLeft: {},
      checkingA: true,
      checkingB: true,
      contextRight: [],
      contextLeft: [],
      groupIndexLeft: [],
      groupIndexRight: [],
      Helper,
      sort: 'right',
      fullscreen: false,
    }
  },
  mounted() {
    this.bindKeys()
  },
  unmounted() {
    this.unbindKeys()
  },
  watch: {
    hitAB() {
      this.bindKeys()
    },
  },
  methods: {
    bindKeys() {
      document.addEventListener('keydown', this.keydown)
      this.$refs.searchSubsA.unbindKeys()
      this.$refs.searchSubsB.unbindKeys()
      if (this.hitAB === 'A') this.$refs.searchSubsA.bindKeys()
      if (this.hitAB === 'B') this.$refs.searchSubsB.bindKeys()
    },
    unbindKeys() {
      document.removeEventListener('keydown', this.keydown)
    },
    keydown(e) {
      if (
        !['INPUT', 'TEXTAREA'].includes(e.target.tagName.toUpperCase()) &&
        !e.metaKey
      ) {
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
    toggleFullscreen() {
      if (this.hitsA.length > 0 || this.hitsB.length > 0)
        this.fullscreen = !this.fullscreen
    },
    sortContextLeft(e) {
      this.sort = 'left'
      e.preventDefault()
    },
    sortContextRight(e) {
      this.sort = 'right'
      e.preventDefault()
    },
    goToHit(hitAB, hit) {
      console.log(hit)
      this.hitAB = hitAB
      if (hitAB === 'A') this.$refs.searchSubsA.goToHit(hit)
      if (hitAB === 'B') this.$refs.searchSubsB.goToHit(hit)
      this.$refs.dropdown.hide()
      setTimeout(() => {
        document.activeElement.blur()
      }, 100)
    },
    collectContext() {
      let contextLeft = this.$refs.searchSubsA.contextLeft
        .concat(this.$refs.searchSubsB.contextLeft)
        .map((s) => s.charAt(0))
      this.contextLeft = Helper.unique(contextLeft).sort((a, b) =>
        a.localeCompare(b, 'zh-CN')
      )
      let contextRight = this.$refs.searchSubsA.contextRight
        .concat(this.$refs.searchSubsB.contextRight)
        .map((s) => s.charAt(0))
      this.contextRight = Helper.unique(contextRight).sort((a, b) =>
        a.localeCompare(b, 'zh-CN')
      )
      this.groupsRight = this.groupContext(this.contextRight, 'right')
      this.groupsLeft = this.groupContext(this.contextLeft, 'left')
      this.groupIndexLeft = this.sortGroupIndex(this.groupsLeft)
      this.groupIndexRight = this.sortGroupIndex(this.groupsRight)
    },
    sortGroupIndex(group) {
      let index = []
      for (let c in group) {
        index.push({ c, length: group[c].A.length + group[c].B.length })
      }
      index = index.sort((a, b) => b.length - a.length)
      return index.map((i) => i.c)
    },
    groupContext(context, leftOrRight) {
      let groups = {}
      for (let ab of ['A', 'B']) {
        for (let c of context) {
          if (!groups[c.charAt(0)]) groups[c.charAt(0)] = {}
          groups[c.charAt(0)][ab] = this[`hits${ab}`].filter((hit) =>
            c.length > 0
              ? hit[`${leftOrRight}Context`].startsWith(c)
              : hit[`${leftOrRight}Context`] === ''
          )
        }
      }
      return groups
    },
    searchSubsALoaded() {
      this.hitsA = this.$refs.searchSubsA.hits
      this.checkingA = false
      if (!this.checkingA && !this.checkingB) {
        this.collectContext()
      }
    },
    searchSubsBLoaded() {
      this.hitsB = this.$refs.searchSubsB.hits
      this.checkingB = false
      if (!this.checkingA && !this.checkingB) {
        this.collectContext()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.compare-search-subs.fullscreen >>> .search-subs .video-area {
  background: black;
}
.compare-search-subs.fullscreen {
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
.compare-search-subs.fullscreen >>> .youtube-video-wrapper {
  max-width: calc((100vh - 9rem) * 16 / 9);
  margin: 0 auto;
}
</style>