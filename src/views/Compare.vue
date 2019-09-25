<template>
  <div class="main" v-cloak>
    <div class="container mt-4 mb-4 focus">
      <div class="row">
        <div class="col-12">
          <SearchCompare :searchEntry="a" :compareEntry="b" :compare="true" />
        </div>
      </div>
      <div class="row mt-4 mb-3">
        <div class="col-6">
          <div class="text-center">
            <Loader v-if="!a" class="mt-5" />
          </div>
          <EntryHeader
            v-if="a"
            :entry="a"
            class="text-center"
            :key="aKey"
          ></EntryHeader>
        </div>
        <div class="col-6">
          <div class="text-center">
            <Loader v-if="!b" class="mt-5" />
          </div>
          <EntryHeader
            v-if="b"
            :entry="b"
            class="text-center"
            :key="aKey"
          ></EntryHeader>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12">
          <CompareDefs
            v-if="a && b"
            :a="a"
            :b="b"
            :key="aKey + bKey"
          ></CompareDefs>
        </div>
      </div>
    </div>
    <div
      class="jumbotron-fluid bg-light mt-5 focus"
      v-if="a && b && a.example && b.example"
    >
      <div class="container">
        <div class="row">
          <div class="col-sm-6">
            <EntryExample
              class="mini"
              :key="aKey"
              :entry="a"
              scale="0.5"
              id="compare-example-a"
            ></EntryExample>
          </div>
          <div class="col-sm-6">
            <EntryExample
              class="mini"
              :key="bKey"
              :entry="b"
              scale="0.5"
              id="compare-example-b"
            ></EntryExample>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-4">
        <div class="col-sm-6">
          <WebImages
            v-if="a"
            :text="a.simplified"
            limit="10"
            :key="aKey"
          ></WebImages>
        </div>
        <div class="col-sm-6">
          <WebImages
            v-if="b"
            :text="b.simplified"
            limit="10"
            :key="bKey"
          ></WebImages>
        </div>
      </div>
    </div>

    <!-- <EntryRelated :entry="entry"></EntryRelated> -->

    <CompareCollocations
      class="mt-5 focus"
      v-if="a && b"
      :a="a"
      :b="b"
    ></CompareCollocations>

    <!-- <EntryCharacters :entry="entry"></EntryCharacters> -->
    <div class="container mt-5 focus">
      <div class="row">
        <div class="col-sm-6">
          <Concordance
            v-if="a"
            :text="a.simplified"
            :level="a.hsk"
            :key="aKey"
          ></Concordance>
        </div>
        <div class="col-sm-6">
          <Concordance
            v-if="b"
            :text="b.simplified"
            :level="b.hsk"
            :key="bKey"
          ></Concordance>
        </div>
      </div>
    </div>

    <div class="container focus mt-5">
      <div class="row">
        <div class="col-sm-6">
          <Grammar v-if="a" :text="a.simplified" :key="aKey"></Grammar>
        </div>
        <div class="col-sm-6">
          <Grammar v-if="b" text="b.simplified" :key="bKey"></Grammar>
        </div>
      </div>
    </div>

    <div class="container mt-5 focus">
      <div class="row">
        <div class="col-sm-6">
          <Mistakes v-if="a" :text="a.simplified" :key="aKey"></Mistakes>
        </div>
        <div class="col-sm-6">
          <Mistakes v-if="b" :text="b.simplified" :key="bKey"></Mistakes>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <Korean v-if="a" class="mt-5 mb-5" :text="a.traditional" />
        </div>
        <div class="col-sm-6">
          <Korean v-if="b" class="mt-5 mb-5" :text="b.traditional" />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <Japanese v-if="a" class="mb-5" :text="a.traditional" />
        </div>
        <div class="col-sm-6">
          <Japanese v-if="b" class="mb-5" :text="b.traditional" />
        </div>
      </div>
    </div>

    <EntryCourseAd
      v-if="a && b"
      :entry="b.hsk > a.hsk ? b : a"
      :key="aKey + bKey"
    ></EntryCourseAd>

    <EntryLyrics v-if="a" :entry="a" limit="1" :key="aKey"></EntryLyrics>

    <EntryLyrics v-if="b" :entry="b" limit="1" :key="bKey"></EntryLyrics>
  </div>
</template>

<script>
import Concordance from '@/components/Concordance.vue'
import EntryCourseAd from '@/components/EntryCourseAd.vue'
import EntryExample from '@/components/EntryExample.vue'
import Grammar from '@/components/Grammar.vue'
import EntryHeader from '@/components/EntryHeader.vue'
import Mistakes from '@/components/Mistakes.vue'
import WebImages from '@/components/WebImages.vue'
import EntryLyrics from '@/components/EntryLyrics.vue'
import CompareCollocations from '@/components/CompareCollocations.vue'
import CompareDefs from '@/components/CompareDefs.vue'
import SearchCompare from '@/components/SearchCompare.vue'
import Helper from '@/lib/helper'
import Korean from '@/components/Korean'
import Japanese from '@/components/Japanese'

export default {
  components: {
    SearchCompare,
    Concordance,
    EntryCourseAd,
    EntryExample,
    Grammar,
    EntryHeader,
    Mistakes,
    EntryLyrics,
    CompareCollocations,
    WebImages,
    Korean,
    Japanese,
    CompareDefs
  },
  data() {
    return {
      a: undefined,
      b: undefined,
      aKey: 0,
      bKey: 100
    }
  },
  methods: {
    route() {
      let method = this.$route.params.method
      let args = this.$route.params.args.split(',')
      if (method && args) {
        if (method === 'cedict') {
          Helper.loaded(
            (LoadedAnnotator, LoadedHSKCEDICT, loadedGrammar, LoadedHanzi) => {
              LoadedHSKCEDICT.getByIdentifier(entry => (this.a = entry), [
                [args[0], args[1], args[2]].join(',')
              ])
              LoadedHSKCEDICT.getByIdentifier(entry => (this.b = entry), [
                [args[3], args[4], args[5]].join(',')
              ])
            }
          )
        } else if (method === 'hsk') {
          Helper.loaded(
            (LoadedAnnotator, LoadedHSKCEDICT, loadedGrammar, LoadedHanzi) => {
              LoadedHSKCEDICT.getByHSKId(entry => (this.a = entry), [args[0]])
              LoadedHSKCEDICT.getByHSKId(entry => (this.b = entry), [args[1]])
            }
          )
        } else if (method === 'simplified') {
          Helper.loaded(
            (LoadedAnnotator, LoadedHSKCEDICT, loadedGrammar, LoadedHanzi) => {
              LoadedHSKCEDICT.lookupSimplified(
                results => (this.a = results[0]),
                [args[0]]
              )
              LoadedHSKCEDICT.lookupSimplified(
                results => (this.b = results[0]),
                [args[1]]
              )
            }
          )
        }
      }
    }
  },
  watch: {
    a() {
      if (this.b)
        document.title = `${this.a.simplified} vs ${
          this.b.simplified
        } | Chinese Learning Wiki`
      this.aKey++
    },
    b() {
      if (this.a)
        document.title = `${this.a.simplified} vs ${
          this.b.simplified
        } | Chinese Learning Wiki`
      this.bKey++
    },
    $route() {
      if (this.$route.name === 'compare') {
        this.route()
      }
    }
  },
  mounted() {
    if (this.$route.name === 'compare') {
      this.route()
    }
  }
}
</script>
