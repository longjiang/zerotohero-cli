<template>
  <div class="phrase">
    <div class="container main mt-5 mb-5">
      <div class="row">
        <div class="col-sm-12">
          <h2 class="text-center mb-3">Lookup phrases not in the dictionary</h2>
          <p class="text-center mb-5">and see how they are used in real contexts.</p>
          <div class="search-compare-wrapper">
            <Search
              placeholder="Lookup a word or phrase"
              type="generic"
              :term="args"
              :defaultURL="text => `#/${$lang.code}/phrase/search/${text}`"
            />
          </div>
          <div :key="args" class="focus">
            <WebImages v-if="args" :text="args" limit="10" class="mt-5" />
            <Collocations v-if="args" :text="args" class="mt-5" />
            <Concordance v-if="args" :text="args" class="mt-5" />
            <EntryYouTube v-if="args" :text="args" class="mt-5" />
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
import EntryYouTube from '@/components/EntryYouTube'

export default {
  components: {
    Search,
    Collocations,
    WebImages,
    Concordance,
    EntryYouTube
  },
  props: {
    method: {
      type: String
    },
    args: {
      type: String
    }
  }
}
</script>

<style></style>
