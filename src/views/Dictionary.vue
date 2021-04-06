<template>
  <div class="main focus" :key="`entry-${entryKey}`">
    <div class="jumbotron jumbotron-fluid bg-white pt-5 pb-3 mb-0">
      <div class="container focus-exclude">
        <div class="row">
          <div class="col-sm-12">
            <div class="text-center">
              <h2 class="mb-4">
                {{ $t('For the love of {l2} words.', { l2: $t($l2.name) }) }}
              </h2>
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
          :key="`paginator-${args}-${paginatorKey}`"
          :items="sW"
          :findCurrent="(item) => item.id === entry.id"
          :url="
            (item) =>
              `/${$l1.code}/${$l2.code}/dictionary/${$dictionaryName}/${item.id}`
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
            <div class="widget">
              <div class="p-4">
              <EntryHeader :entry="entry" :key="`header-${args}`"></EntryHeader>
              <DefinitionsList
                :key="`def-list-${args}`"
                v-if="entry.definitions"
                class="mt-4"
                :definitions="entry.definitions"
              ></DefinitionsList>
              </div>
              <EntryExample :entry="entry"></EntryExample>
            </div>
          </div>
        </div>
      </div>

      <!-- <EntryDisambiguation> already finds some pretty good suggestions. -->
      <!-- <EntryRelated class="mb-5" :entry="entry"></EntryRelated> -->

      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <WebImages
              class="mt-5"
              :text="entry.bare"
              :entry="entry"
              limit="10"
            />
            <EntryForms v-if="$l2.code === 'ru'" class="mt-5" :word="entry" />
            <Collocations
              class="mt-5 mb-5"
              :word="entry"
              :level="entry.level"
            />
          </div>
        </div>
      </div>
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <EntryYouTube :text="entry.bare" class="mb-5" />
            </div>
          </div>
        </div>
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <Concordance class="mt-5 mb-5" :word="entry" :level="entry.level" />
          </div>
        </div>

        <div class="row mt-5 d-flex" style="flex-wrap: wrap">
          <EntryDifficulty :entry="entry" style="flex: 1" class="m-3" />
          <EntryDisambiguation
            :entry="entry"
            class="m-3"
            style="flex: 1; min-width: 20rem"
          ></EntryDisambiguation>
        </div>


        <div class="row">
          <div class="col-sm-12">
            <EntryRelated :entry="entry" class="mb-5" />

            <Mistakes
              class="mt-5 mb-5"
              v-if="$l2.code === 'zh'"
              :text="entry.simplified"
            ></Mistakes>
          </div>
        </div>
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
          <div class="col-sm-6" v-if="$l2.code !== 'zh'">
            <Chinese
              v-if="
                entry.cjk &&
                entry.cjk.canonical &&
                entry.cjk.canonical !== 'NULL'
              "
              class="mt-5 mb-5"
              :text="entry.cjk.canonical"
            />
          </div>
          <div class="col-sm-6" v-if="$l2.code !== 'ja'">
            <Japanese
              v-if="
                entry.cjk &&
                entry.cjk.canonical &&
                entry.cjk.canonical !== 'NULL'
              "
              class="mt-5 mb-5"
              :text="entry.cjk.canonical"
            />
          </div>
          <div class="col-sm-6" v-if="$l2.code !== 'ko'">
            <Korean
              v-if="
                entry.cjk &&
                entry.cjk.canonical &&
                entry.cjk.canonical !== 'NULL'
              "
              class="mt-5 mb-5"
              :text="entry.cjk.canonical"
            />
          </div>
        </div>
      </div>
      <EntryCourseAd v-if="$l2.code === 'zh'" :entry="entry" class="focus-exclude"></EntryCourseAd>
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
import Mistakes from '@/components/Mistakes'
import EntryCourseAd from '@/components/EntryCourseAd'
import EntryLyrics from '@/components/EntryLyrics'
import InstagramButton from '@/components/InstagramButton'
import EntryRelated from '@/components/EntryRelated'
import EntryExample from '@/components/EntryExample'
import EntryDifficulty from '@/components/EntryDifficulty'
import EntryDisambiguation from '@/components/EntryDisambiguation'
import { mapState } from 'vuex'

export default {
  components: {
    EntryExample,
    EntryDifficulty,
    EntryDisambiguation,
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
    EntryCharacters,
    Mistakes,
    EntryCourseAd,
    EntryLyrics,
    InstagramButton,
    EntryRelated,
  },
  props: {
    method: {
      type: String,
    },
    args: {
      type: String,
    },
  },
  data() {
    return {
      l1Name: this.$l1.name,
      entry: undefined,
      characters: [],
      character: {},
      unsplashSrcs: [],
      unsplashSearchTerm: '',
      entryKey: 0,
      paginatorKey: 0
    }
  },
  computed: mapState(['savedWords']),
  methods: {
    async updateWords() {
      this.sW = []
      this.savedTexts = []
      if (
        this.$store.state.savedWords &&
        this.$store.state.savedWords[this.$l2.code]
      ) {
        for (let savedWord of this.$store.state.savedWords[this.$l2.code]) {
          let word = await (await this.$dictionary).get(savedWord.id)
          if (word) {
            this.sW.push(word)
          }
        }
      }
      this.paginatorKey++
    },
    saved() {
      return (
        this.entry &&
        this.$store.getters.hasSavedWord({
          text: this.entry.bare.toLowerCase(),
          l2: this.$l2.code,
        })
      )
    },
    show(entry) {
      this.entryKey += 1
      for (let definition of entry.definitions) {
        definition = definition.replace(/\[.*\] /g, '')
        if (definition.startsWith('CL')) {
          
          let counters = definition.replace('CL:', '').split(',')
          let cs = []
          for (let counter of counters) {
            let c = {
              pinyin: counter.replace(/.*\[(.*)\]/, '$1')
            }
            let t = counter.replace(/\[(.*)\]/, '').split('|')
            c.simplified = t[t.length - 1]
            c.traditional = t[0]
            cs.push(c)
          }
          entry.counters = cs
        }
      }
      entry.definitions = entry.definitions.filter((def) => !def.startsWith('CL'))
      this.entry = entry
      document.title = `${entry.bare} (${entry.definitions[0]}) | ${
        this.$l2 ? this.$l2.name : ''
      } Zero to Hero`
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
      this.$router.push({path: `/${this.$l1.code}/${this.$l2.code}/dictionary/${this.$dictionaryName}/${randomId}`})
    },
  },
  watch: {
    $route() {
      if (this.$route.name === 'dictionary') {
        this.route()
      }
    },
    savedWords() {
      this.updateWords()
    },
  },
  mounted() {
    if (this.$route.name === 'dictionary') {
      this.route()
      this.updateWords()
    }
  },
}
</script>

<style></style>
