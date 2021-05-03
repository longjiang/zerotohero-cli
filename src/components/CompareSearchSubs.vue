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
        <template v-for="(hits, c) in sort === 'right' ? hitsRight : hitsLeft">
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
            v-for="index in Math.max(hits.A.length, hits.B.length)"
            :key="`comp-subs-grouping-${c}-${index}`"
            @click="
              hits.A[index - 1]
                ? goToHit('A', hits.A[index - 1])
                : hits.B[index - 1]
                ? goToHit('B', hits.B[index - 1])
                : false
            "
          >
            <div style="display: flex">
              <template v-for="ab in ['A', 'B']">
                <div
                  :style="`flex: 1; margin-right: ${
                    ab === 'A' ? '1rem' : 0
                  }; display: flex;`"
                  v-if="hits[ab][index - 1]"
                  @click.stop.prevent="goToHit(ab, hits[ab][index - 1])"
                  :set="(hit = hits[ab][index - 1])"
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
                  v-if="!hits[ab][index - 1]"
                  style="flex: 1; margin-right: 1rem"
                  :key="`comp-subs-grouping-${c}-${index}-${ab}-2`"
                >
                  &nbsp;
                </div>
              </template>
            </div>
          </b-dropdown-item>
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
      hitsRight: {},
      hitsLeft: {},
      checkingA: true,
      checkingB: true,
      contextRight: [],
      contextLeft: [],
      Helper,
      sort: 'right',
      fullscreen: false,
    }
  },
  methods: {
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
    goToHit(hitAB, hit, e = false) {
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

      for (let c of this.contextRight) {
        if (!this.hitsRight[c.charAt(0)]) this.hitsRight[c.charAt(0)] = {}
        this.hitsRight[c.charAt(0)].A = this.hitsA.filter((hit) =>
          c.length > 0
            ? hit.rightContext.startsWith(c)
            : hit.rightContext === ''
        )
        this.hitsRight[c.charAt(0)].B = this.hitsB.filter((hit) =>
          c.length > 0
            ? hit.rightContext.startsWith(c)
            : hit.rightContext === ''
        )
      }

      for (let c of this.contextLeft) {
        if (!this.hitsLeft[c.charAt(0)]) this.hitsLeft[c.charAt(0)] = {}
        this.hitsLeft[c.charAt(0)].A = this.hitsA.filter((hit) =>
          c.length > 0 ? hit.leftContext.startsWith(c) : hit.leftContext === ''
        )
        this.hitsLeft[c.charAt(0)].B = this.hitsB.filter((hit) =>
          c.length > 0 ? hit.leftContext.startsWith(c) : hit.leftContext === ''
        )
      }
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