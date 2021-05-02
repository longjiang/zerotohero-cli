<template>
  <div>
    <div class="text-center search-subs">
      <b-button
        class="mr-2 btn btn-small"
        :data-bg-level="levelA"
        @click="hitAB = 'A'"
        >{{ termsA[0] }}</b-button
      >

      <b-dropdown
        class="m-md-2 primary playlist-dropdown"
        toggle-class="playlist-dropdown-toggle"
        boundary="viewport"
        no-caret
      >
        <template #button-content
          ><i class="fa fa-stream" /> Compare Hits</template
        >
        <b-dropdown-item
          ><button class="btn btn-small" @click.stop="sortContextLeft">
            Sort Left</button
          ><button class="btn btn-small" @click.stop="sortContextRight">
            Sort Right
          </button></b-dropdown-item
        >
        <template v-for="c in contextRight">
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
          <div
            :set="
              (hits = [
                hitsA.filter((hit) =>
                  c.length > 0
                    ? hit.rightContext.startsWith(c)
                    : hit.rightContext === ''
                ),
                hitsB.filter((hit) =>
                  c.length > 0
                    ? hit.rightContext.startsWith(c)
                    : hit.rightContext === ''
                ),
              ])
            "
          >
            <b-dropdown-item
              v-for="index in Math.max(hits[0].length, hits[1].length)"
            >
              <div style="display: flex">
                <div style="flex: 1" v-if="hits[0][index - 1]">
                  <span
                    v-if="hits[0][index - 1].lineIndex > 0"
                    v-html="hits[0][index - 1].video.subs_l2[Number(hits[0][index - 1].lineIndex) - 1].line"
                    style="margin-right: 0.5em; opacity: 0.5"
                  />
                  <span
                    v-html="
                      Helper.highlightMultiple(
                        hits[0][index - 1].video.subs_l2[
                              Number(hits[0][index - 1].lineIndex)
                            ].line,
                        termsA.map((term) => term),
                        levelA
                      )
                    "
                  />
                  <span
                    v-if="hits[0][index - 1].lineIndex < hits[0][index - 1].video.subs_l2.length - 1"
                    v-html="hits[0][index - 1].video.subs_l2[Number(hits[0][index - 1].lineIndex) + 1].line"
                    style="margin-left: 0.5em; opacity: 0.5"
                  ></span>
                </div>
                <div v-if="!hits[0][index - 1]" style="flex: 1">&nbsp;</div>
                <div style="flex: 1" v-if="hits[1][index - 1]">
                  <span
                    v-if="hits[1][index - 1].lineIndex > 0"
                    v-html="hits[1][index - 1].video.subs_l2[Number(hits[1][index - 1].lineIndex) - 1].line"
                    style="margin-right: 0.5em; opacity: 0.5"
                  />
                  <span
                    v-html="
                      Helper.highlightMultiple(
                        hits[1][index - 1].video.subs_l2[
                              Number(hits[1][index - 1].lineIndex)
                            ].line,
                        termsB.map((term) => term),
                        levelB
                      )
                    "
                  />
                  <span
                    v-if="hits[1][index - 1].lineIndex < hits[1][index - 1].video.subs_l2.length - 1"
                    v-html="hits[1][index - 1].video.subs_l2[Number(hits[1][index - 1].lineIndex) + 1].line"
                    style="margin-left: 0.5em; opacity: 0.5"
                  ></span>
                </div>
                <div v-if="!hits[1][index - 1]" style="flex: 1">&nbsp;</div>
              </div>
            </b-dropdown-item>
          </div>
        </template>
      </b-dropdown>
      <b-button
        class="btn btn-small"
        :data-bg-level="levelB"
        @click="hitAB = 'B'"
        >{{ termsB[0] }}</b-button
      >
    </div>
    <SearchSubsComp
      :class="{ 'd-none': hitAB === 'B' }"
      ref="searchSubsA"
      :level="levelA"
      :terms="termsA"
      :key="`subs-search-${termsA[0]}`"
      @loaded="searchSubsALoaded"
    />
    <SearchSubsComp
      :class="{ 'd-none': hitAB === 'A' }"
      ref="searchSubsB"
      :level="levelB"
      :terms="termsB"
      :key="`subs-search-${termsB[0]}`"
      @loaded="searchSubsBLoaded"
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
      checkingA: true,
      checkingB: true,
      contextRight: [],
      contextLeft: [],
      Helper,
    }
  },
  methods: {
    sortContextLeft() {},
    sortContextRight() {},
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