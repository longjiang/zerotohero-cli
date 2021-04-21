<template>
  <div class="phrase">
    <div class="container main mt-5 mb-5">
      <div class="row">
        <div class="col-sm-12">
          <h2 class="text-center mb-3">Lookup phrases not in the dictionary</h2>
          <p class="text-center mb-5">
            and see how they are used in real contexts.
          </p>
          <div class="search-compare-wrapper">
            <Search
              placeholder="Lookup a word or phrase"
              type="generic"
              :term="term"
              :key="`${term}-search`"
              :defaultURL="
                (text) => `/${$l1.code}/${$l2.code}/phrase/search/${text}`
              "
            />
          </div>
          <div class="focus">
            <WebImages
              v-if="term"
              :text="term"
              limit="10"
              class="mt-5"
              :key="`${term}-images`"
            />
            <Collocations
              v-if="term"
              :text="term"
              class="mt-5"
              :key="`${term}-col`"
            />
          </div>
          <div
            class="widget mt-5"
            id="search-subs"
            :key="`subs-search-${term}`"
          >
            <div class="widget-title">“{{ term }}” in TV Shows</div>
            <div class="widget-body">
              <SearchSubsComp
                v-if="term && delayed"
                ref="searchSubs"
                level="outside"
                :key="`${term}-search-subs`"
                :terms="[term]"
              />
            </div>
          </div>
          <div :key="term" class="focus">
            <Concordance
              v-if="term"
              :text="term"
              class="mt-5"
              :key="`${term}-concordance`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Concordance from '@/components/Concordance'
import Collocations from '@/components/Collocations'
import Search from '@/components/Search'
import WebImages from '@/components/WebImages'
import SearchSubsComp from '@/components/SearchSubsComp'

export default {
  components: {
    Search,
    Collocations,
    WebImages,
    Concordance,
    SearchSubsComp,
  },
  props: {
    method: {
      type: String,
    },
    term: {
      type: String,
    },
  },
  data() {
    return {
      delayed: {
        default: false,
      }
    }
  },
  watch: {
    $route() {
      this.route()
    },
  },
  methods: {
    route() {
      this.delayed = false
      setTimeout(() => {
        this.delayed = true
      }, 1000)
    },
  },
  mounted() {
    this.route()
  }
}
</script>

<style></style>
