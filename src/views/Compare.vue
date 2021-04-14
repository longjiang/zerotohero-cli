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
          <div class="col-sm-6 mt-5 mb-5">
            <EntryExample
              :key="aKey"
              :entry="a"
              id="compare-example-a"
            ></EntryExample>
          </div>
          <div class="col-sm-6 mt-5 mb-5">
            <EntryExample
              :key="bKey"
              :entry="b"
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
            :text="a.bare"
            limit="10"
            :key="aKey"
          ></WebImages>
        </div>
        <div class="col-sm-6">
          <WebImages
            v-if="b"
            :text="b.bare"
            limit="10"
            :key="bKey"
          ></WebImages>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <CompareCollocations
            class="mt-5 focus"
            v-if="a && b"
            :a="a"
            :b="b"
          ></CompareCollocations>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-sm-6 mt-5">
          <div class="widget" v-if="a" :key="aKey">
            <div class="widget-title">Mentions of “{{ a.bare }}” on TV</div>
            <div class="widget-body">
              <SearchSubsComp :level="a.hsk" :terms="a.simplified === a.traditional ? [a.simplified] : [a.simplified, a.traditional]"  class="mt-4 mb-4" />
            </div>
          </div>
        </div>
        <div class="col-sm-6 mt-5">
          <div class="widget" v-if="b" :key="bKey">
            <div class="widget-title">Mentions of “{{ b.bare }}” on TV</div>
            <div class="widget-body">
              <SearchSubsComp :level="b.hsk" :terms="b.simplified === b.traditional ? [b.simplified] : [b.simplified, b.traditional]"  class="mt-4 mb-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container">
      <div class="row">
        <div class="col-sm-12 mt-5" v-if="a">
          <EntryRelated :key="aKey" :entry="a"></EntryRelated>
        </div>
        <div class="col-sm-12 mt-5" v-if="b">
          <EntryRelated :key="bKey" :entry="b"></EntryRelated>
        </div>
      </div>
    </div>

    <!-- <EntryCharacters :entry="entry"></EntryCharacters> -->
    <div class="container mt-5 focus">
      <div class="row">
        <div class="col-sm-6">
          <Concordance
            v-if="a"
            :text="a.bare"
            :level="a.hsk"
            :key="aKey"
          ></Concordance>
        </div>
        <div class="col-sm-6">
          <Concordance
            v-if="b"
            :text="b.bare"
            :level="b.hsk"
            :key="bKey"
          ></Concordance>
        </div>
      </div>
    </div>

    <div class="container focus mt-5">
      <div class="row">
        <div class="col-sm-6">
          <Grammar v-if="a" :text="a.bare" :key="aKey"></Grammar>
        </div>
        <div class="col-sm-6">
          <Grammar v-if="b" text="b.bare" :key="bKey"></Grammar>
        </div>
      </div>
    </div>

    <div class="container focus">
      <!--
      <div class="row">
        <div class="col-sm-6">
          <Mistakes v-if="a" :text="a.bare" :key="aKey"></Mistakes>
        </div>
        <div class="col-sm-6">
          <Mistakes v-if="b" :text="b.bare" :key="bKey"></Mistakes>
        </div>
      </div>
      -->

      <div class="row" v-if="['ja', 'ko'].includes($l2.code)">
        <div class="col-sm-6">
          <Chinese v-if="a && a.cjk && a.cjk.canonical && a.cjk.canonical !== 'NULL'" :text="a.cjk.canonical" />
        </div>
        <div class="col-sm-6">
          <Chinese v-if="b && b.cjk && b.cjk.canonical && b.cjk.canonical !== 'NULL'" :text="b.cjk.canonical" />
        </div>
      </div>
      <div class="row" v-if="['zh', 'ja'].includes($l2.code)">
        <div class="col-sm-6">
          <Korean v-if="a && a.cjk && a.cjk.canonical && a.cjk.canonical !== 'NULL'" class="mb-5" :text="a.cjk.canonical" />
        </div>
        <div class="col-sm-6">
          <Korean v-if="b && b.cjk && b.cjk.canonical && b.cjk.canonical !== 'NULL'" class="mb-5" :text="b.cjk.canonical" />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6" v-if="['zh', 'ko'].includes($l2.code)">
          <Japanese v-if="a && a.cjk && a.cjk.canonical && a.cjk.canonical !== 'NULL'" class="mb-5" :text="a.cjk.canonical" />
        </div>
        <div class="col-sm-6">
          <Japanese v-if="b && b.cjk && b.cjk.canonical && b.cjk.canonical !== 'NULL'" class="mb-5" :text="b.cjk.canonical" />
        </div>
      </div>
    </div>

    <EntryCourseAd
      v-if="$l2 === 'zh' && a && b"
      :entry="b.hsk > a.hsk ? b : a"
      :key="aKey + bKey"
    ></EntryCourseAd>
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
import Korean from '@/components/Korean'
import Japanese from '@/components/Japanese'
import Chinese from '@/components/Chinese'
import EntryRelated from '@/components/EntryRelated'
import SearchSubsComp from '@/components/SearchSubsComp'

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
    Chinese,
    CompareDefs,
    EntryRelated,
    SearchSubsComp
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
    async route() {
      let method = this.$route.params.method
      let args = this.$route.params.args.split(',')
      let aId = args[0]
      let bId = args[1]
      if (args.length === 6) { // When we use hsk-cedict for chinese
        aId = [args[0], args[1], args[2]].join(',')
        bId = [args[3], args[4], args[5]].join(',')
      }
      if (method && args) {
        if (method === 'hsk') {
          this.a = await (await this.$dictionary).getByHSKId(aId) 
          this.b = await (await this.$dictionary).getByHSKId(bId)
        } else if (method === 'bare') {
          let resultsA = await (await this.$dictionary).lookupbare(aId)
          this.a = resultsA[0]
          let resultsB = await (await this.$dictionary).lookupbare(bId)
          this.b = resultsB[0]
        } else if (method === 'simplified') {
          let resultsA = await (await this.$dictionary).lookupSimplified(args[0])
          this.a = resultsA[0]
          let resultsB = await (await this.$dictionary).lookupSimplified(args[1])
          this.b = resultsB[0]
        } else if (method === 'traditional') {
          let resultsA = await (await this.$dictionary).lookupTraditional(args[0])
          this.a = resultsA[0]
          let resultsB = await (await this.$dictionary).lookupTraditional(args[1])
          this.b = resultsB[0]
        } else {
          this.a = await (await this.$dictionary).get(aId)
          this.b = await (await this.$dictionary).get(bId)
        }
      }
    }
  },
  watch: {
    a() {
      if (this.b)
        document.title = `${this.a.bare} vs ${
          this.b.bare
        } | Zero to Hero`
      this.aKey++
    },
    b() {
      if (this.a)
        document.title = `${this.a.bare} vs ${
          this.b.bare
        } | Zero to Hero`
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
