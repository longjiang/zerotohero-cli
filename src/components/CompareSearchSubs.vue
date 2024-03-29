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
      v-if="this.$refs.searchSubsA && this.$refs.searchSubsB"
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
            @click.stop.prevent="sort = 'left'"
          >
            Sort Left</button
          ><button
            :class="{
              btn: true,
              'btn-small': true,
              'bg-dark': sort === 'right',
              'text-white': sort === 'right',
            }"
            @click.stop.prevent="sort = 'right'"
          >
            Sort Right
          </button></b-dropdown-item
        >
        <template v-for="group in groups[sort]">
          <div v-if="group" :key="`compare-subs-grouping-${sort}-${group.c}`">
            <b-dropdown-divider
              :key="`comp-subs-grouping-${group.c}-divider`"
            />
            <b-dropdown-item
              v-for="index in Math.max(
                group.hits.A.length,
                group.hits.B.length
              )"
              :key="`comp-subs-grouping-${group.c}-${index}`"
              @click="
                group.hits.A[index - 1]
                  ? goToHit('A', group.hits.A[index - 1])
                  : group.hits.B[index - 1]
                  ? goToHit('B', group.hits.B[index - 1])
                  : false
              "
            >
              <div style="display: flex">
                <template v-for="ab in ['A', 'B']">
                  <div
                    :style="`flex: 1; margin-right: ${
                      ab === 'A' ? '1rem' : 0
                    }; display: flex;`"
                    v-if="group.hits[ab][index - 1]"
                    @click.stop.prevent="
                      goToHit(
                        ab,
                        sort === 'right'
                          ? group.hits[ab][index - 1]
                          : group.hits[ab][index - 1]
                      )
                    "
                    :set="(hit = group.hits[ab][index - 1])"
                    :key="`comp-subs-grouping-${group.c}-${index}-${ab}-1`"
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
                        :checkSaved="false"
                        :sticky="true"
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
                    v-if="!group.hits[ab][index - 1]"
                    style="flex: 1; margin-right: 1rem"
                    :key="`comp-subs-grouping-${group.c}-${index}-${ab}-2`"
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
    keyboard: {
      default: true
    }
  },
  data() {
    return {
      hitAB: 'A',
      checkingA: true,
      checkingB: true,
      Helper,
      sort: 'right',
      fullscreen: false,
    }
  },
  destroyed() {
    if (this.keyboard) this.unbindKeys()
  },
  unmounted() {
    if (this.keyboard) this.unbindKeys()
  },
  deactivated() {
    if (this.keyboard) this.unbindKeys()
  },
  updated() {
    if (this.keyboard) this.unbindKeys()
    if (this.keyboard) this.bindKeys()
  },
  computed: {
    groups() {
      return {
        left: this.mergeGroups({
          A: this.$refs.searchSubsA.groupsLeft,
          B: this.$refs.searchSubsB.groupsLeft,
        }),
        right: this.mergeGroups({
          A: this.$refs.searchSubsA.groupsRight,
          B: this.$refs.searchSubsB.groupsRight,
        }),
      }
    },
  },
  watch: {
    hitAB() {
      this.unbindKeys()
      this.bindKeys()
    },
  },
  methods: {
    mergeGroups(groups) {
      let merged = []
      for (let letter of ['A', 'B']) {
        for (let key in groups[letter]) {
          let hits = groups[letter][key]
          let group = merged.find((g) => g.c === key)
          if (!group) {
            group = {
              c: key,
              hits: {
                A: [],
                B: [],
              },
            }
            merged.push(group)
          }
          group.hits[letter] = hits
        }
      }
      merged = merged.sort((a, b) => (b.hits.A.length + b.hits.B.length) - (a.hits.A.length + a.hits.B.length))
      let zthSavedIndex = merged.findIndex(g => g.c === 'zthSaved')
      let zthSaved = merged[zthSavedIndex]
      merged.splice(zthSavedIndex, 1)
      merged = [zthSaved].concat(merged)
      return merged
    },
    bindKeys() {
      document.addEventListener('keydown', this.keydown)
      if (this.$refs.searchSubsA) this.$refs.searchSubsA.unbindKeys()
      if (this.$refs.searchSubsB) this.$refs.searchSubsB.unbindKeys()
      if (this.hitAB === 'A') this.$refs.searchSubsA.bindKeys()
      if (this.hitAB === 'B') this.$refs.searchSubsB.bindKeys()
    },
    unbindKeys() {
      if (this.$refs.searchSubsA) this.$refs.searchSubsA.unbindKeys()
      if (this.$refs.searchSubsB) this.$refs.searchSubsB.unbindKeys()
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
    goToHit(hitAB, hit) {
      this.hitAB = hitAB
      if (hitAB === 'A') this.$refs.searchSubsA.goToHit(hit)
      if (hitAB === 'B') this.$refs.searchSubsB.goToHit(hit)
      this.$refs.dropdown.hide()
      setTimeout(() => {
        document.activeElement.blur()
      }, 100)
    },
    searchSubsALoaded() {
      this.hitsA = this.$refs.searchSubsA.hits
      this.checkingA = false
    },
    searchSubsBLoaded() {
      this.hitsB = this.$refs.searchSubsB.hits
      this.checkingB = false
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