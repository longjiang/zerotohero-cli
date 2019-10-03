<template>
  <div class="main focus" :key="`entry-${entryKey}`">
    <div class="jumbotron jumbotron-fluid bg-white pt-5 pb-3 mb-0">
      <div class="container focus-exclude">
        <div class="row">
          <div class="col-sm-12">
            <div class="text-center">
              <h2 class="mb-4">{{ $t('For the love of {l2} words.', {l2: $t($l2.name)}) }}</h2>
              <Loader ref="loader" class="mb-5" />
            </div>
            <SearchCompare
              :searchEntry="entry"
              class="mb-5"
              :key="`search-${args}`"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="saved()"
      class="jumbotron jumbotron-fluid pt-3 pb-3 bg-secondary"
    >
      <div class="container focus-exclude text-center text-light">
        <Paginator
          :key="`paginator-${args}`"
          :items="$store.state.savedWords"
          :findCurrent="item => item.join(',').replace(/ /g, '_') === entry.id"
          :url="
            item =>
              `#/${$l1.code}/${$l2.code}/dictionary/${$dictionaryName}/${item.join(',').replace(/ /g, '_')}`
          "
          title="Saved Words"
        />
      </div>
    </div>
    <div v-if="entry">
      <div class="text-center">
        <!-- <Loader class="mt-5" /> -->
      </div>
      <div class="container mb-4">
        <div class="row">
          <div class="col-sm-12 text-center">
            <EntryHeader :entry="entry" :key="`header-${args}`"></EntryHeader>
            <DefinitionsList
              :key="`def-list-${args}`"
              v-if="entry.definitions"
              class="mt-4"
              :definitions="entry.definitions"
            ></DefinitionsList>
          </div>
        </div>
      </div>

      <!-- <EntryDisambiguation> already finds some pretty good suggestions. -->
      <!-- <EntryRelated class="mb-5" :entry="entry"></EntryRelated> -->

      <div class="container">
        <div class="row" v-if="['zh', 'ja', 'ko'].includes($l2.code)">
          <div class="col-sm-12" v-if="$l2.code !== 'zh'">
            <EntryCharacters
              v-if="entry.cjk && entry.cjk.canonical"
              class="mb-4"
              :text="entry.cjk.canonical"
              :pinyin="entry.cjk.phonetics ? entry.cjk.phonetics : undefined"
            ></EntryCharacters>
          </div>
          <div class="col-sm-12" v-else>
            <EntryCharacters
              class="mb-4 simplified"
              :text="entry.simplified"
              :pinyin="entry.pinyin"
            ></EntryCharacters>
            <EntryCharacters
              class="mb-4 traditional"
              :text="entry.traditional"
              :pinyin="entry.pinyin"
            ></EntryCharacters>
          </div>
        </div>
        <div class="row" v-if="['zh', 'ja', 'ko'].includes($l2.code)">
          <div class="col-sm-6" v-if="$l2.code !== 'zh'">
            <Chinese
              v-if="entry.cjk && entry.cjk.canonical && entry.cjk.canonical !== 'NULL'"
              class="mt-5 mb-5"
              :text="entry.cjk.canonical"
            />
          </div>
          <div class="col-sm-6" v-if="$l2.code !== 'ja'">
            <Japanese
              v-if="entry.cjk && entry.cjk.canonical && entry.cjk.canonical !== 'NULL'"
              class="mt-5 mb-5"
              :text="entry.cjk.canonical"
            />
          </div>
          <div class="col-sm-6" v-if="$l2.code !== 'ko'">
            <Korean
              v-if="entry.cjk && entry.cjk.canonical && entry.cjk.canonical !== 'NULL'"
              class="mt-5 mb-5"
              :text="entry.cjk.canonical"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <WebImages
              class="mt-5"
              :text="entry.bare"
              :entry="entry"
              limit="10"
            />
            <EntryForms class="mt-5" :word="entry" />
            <Collocations
              class="mt-5 mb-5"
              :word="entry"
              :level="entry.level"
            />
            <Concordance
              class="mt-5 mb-5"
              :word="entry"
              :level="entry.level"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <EntryYouTube
              :text="entry.bare"
              class="mb-5"
            />
          </div>
        </div>
      </div>
      <!-- <InstagramButton :entry="entry" class="mb-5"></InstagramButton> -->
    </div>
  </div>
</template>

<script>
import Concordance from '@/components/Concordance.vue'
import Collocations from '@/components/Collocations.vue'
import EntryHeader from '@/components/EntryHeader.vue'
import WebImages from '@/components/WebImages.vue'
import SearchCompare from '@/components/SearchCompare.vue'
import DefinitionsList from '@/components/DefinitionsList'
import Paginator from '@/components/Paginator'
import EntryYouTube from '@/components/EntryYouTube.vue'
import EntryForms from '@/components/EntryForms'
import EntryCharacters from '@/components/EntryCharacters'
import Chinese from '@/components/Chinese'
import Japanese from '@/components/Japanese'
import Korean from '@/components/Korean'

export default {
  components: {
    Chinese,
    Japanese,
    Korean,
    EntryForms,
    SearchCompare,
    Collocations,
    Concordance,
    EntryHeader,
    DefinitionsList,
    Paginator,
    WebImages,
    EntryYouTube,
    EntryCharacters
  },
  props: {
    method: {
      type: String
    },
    args: {
      type: String
    }
  },
  data() {
    return {
      l1Name: this.$l1.name,
      entry: undefined,
      characters: [],
      character: {},
      unsplashSrcs: [],
      unsplashSearchTerm: '',
      entryKey: 0
    }
  },
  methods: {
    saved() {
      return false
      // return this.entry && this.$store.getters.hasSavedWord(this.entry.id)
    },
    show(entry) {
      this.entryKey += 1
      entry.definitions = entry.definitions.map(definition => definition.replace(/\[.*\] /g, ''))
      this.entry = entry
      document.title = `${entry.bare} (${entry.definitions[0]}) | ${this.$l2 ? this.$l2.name : ''} Zero to Hero`
    },
    async route() {
      if (this.method && this.args) {
        if (this.method === this.$dictionaryName) {
          if (this.args === 'random') {
            this.random()
          } else {
            let entry = await (await this.$dictionary).get(this.args)
            this.show(entry)
          }
        } else if (this.method === 'hsk') {
          let entry = await (await this.$dictionary).getByHSKId(this.args)
          this.show(entry)
        }
      }
    },
    async random() {
      let randomId = (await (await this.$dictionary).random()).id
      location.hash = `#/${this.$l1.code}/${this.$l2.code}/dictionary/${this.$dictionaryName}/${randomId}`
    }
  },
  watch: {
    $route() {
      if (this.$route.name === 'dictionary') {
        this.route()
      }
    }
  },
  mounted() {
    if (this.$route.name === 'dictionary') {
      this.route()
    }
  }
}
</script>

<style></style>
