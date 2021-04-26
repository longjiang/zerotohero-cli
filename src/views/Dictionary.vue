<template>
  <div class="main focus" :key="`entry-${entryKey}`">
    <div class="jumbotron jumbotron-fluid bg-white pt-4 pb-0 mb-4">
      <div class="container focus-exclude">
        <div class="row">
          <div class="col-sm-12">
            <div class="text-center">
              <Loader ref="loader" class="mb-5" />
            </div>
            <SearchCompare
              :searchEntry="entry"
              ref="searchCompare"
              :key="`search-${args}`"
              id="search-compare-bar"
            />
          </div>
        </div>
        <h2
          class="mt-5 mb-5 text-center"
          v-if="!entry"
          style="min-height: 10rem"
        >
          {{ $t('For the love of {l2} words.', { l2: $t($l2.name) }) }}
        </h2>
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
      <div class="container">
        <div class="row">
          <div class="col-sm-12 text-center">
            <div>
              <div class="p-4">
                <EntryHeader
                  :entry="entry"
                  :key="`header-${args}`"
                  @prevWord="prevWord()"
                  @nextWord="nextWord()"
                ></EntryHeader>
                <DefinitionsList
                  :key="`def-list-${args}`"
                  v-if="entry.definitions"
                  class="mt-4"
                  :definitions="entry.definitions"
                ></DefinitionsList>
              </div>
              <EntryExample
                :entry="entry"
                class="mb-4"
                :key="`${entry.id}-example`"
              ></EntryExample>
              <div v-if="$l2.code==='zh'">
                <div class="ext-dictionary-buttons p-2 bg-white">
                  <b-button @click="setExtDict('zdic')" class="mr-2 btn btn-small" :data-bg-level="extDict === 'zdic' ? entry.newHSK && entry.newHSK === '7-9' ? '7-9' : entry.hsk : false">汉典</b-button>
                  <b-button @click="setExtDict('wiktionary')" class="mr-2 btn btn-small" :data-bg-level="extDict === 'wiktionary' ? entry.newHSK && entry.newHSK === '7-9' ? '7-9' : entry.hsk : false">Wiktionary</b-button>
                  <b-button @click="setExtDict('moedict')" class="mr-2 btn btn-small" :data-bg-level="extDict === 'moedict' ? entry.newHSK && entry.newHSK === '7-9' ? '7-9' : entry.hsk : false">萌典</b-button>
                  <b-button @click="setExtDict('baidu-baike')" class="mr-2 btn btn-small" :data-bg-level="extDict === 'baidu-baike' ? entry.newHSK && entry.newHSK === '7-9' ? '7-9' : entry.hsk : false">百度百科</b-button>
                  <b-button @click="setExtDict('naver')" class="mr-2 btn btn-small" :data-bg-level="extDict === 'naver' ? entry.newHSK && entry.newHSK === '7-9' ? '7-9' : entry.hsk : false">Naver</b-button>
                </div>
                <div class="mb-4 pl-2 pr-2">
                  <iframe v-if="extDict === 'zdic'" :src="`https://www.zdic.net/hans/${entry.simplified}`" class="ext-dictinoary-iframe"></iframe>
                  <iframe v-if="extDict === 'wiktionary'" :src="`https://en.wiktionary.org/wiki/${entry.simplified}`" class="ext-dictinoary-iframe"></iframe>
                  <iframe v-if="extDict === 'moedict'" :src="`https://www.moedict.tw/${entry.traditional}`" class="ext-dictinoary-iframe"></iframe>
                  <iframe v-if="extDict === 'baidu-baike'" :src="`https://baike.baidu.com/item/${entry.simplified}`" class="ext-dictinoary-iframe"></iframe>
                  <iframe v-if="extDict === 'naver'" :src="`https://korean.dict.naver.com/kozhdict/chinese/#/search?query=${entry.simplified}`" class="ext-dictinoary-iframe"></iframe>
                </div>
              </div>
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
              ref="images"
              @loaded="webImagesLoaded"
            />
            <EntryRelated
              :entry="entry"
              class="mt-5"
              :key="`related-${entry.id}`"
            />
            <EntryForms v-if="$l2.code === 'ru'" class="mt-5" :word="entry" />
            <Collocations
              class="mt-5 mb-5"
              :word="entry"
              :level="entry.newHSK && entry.newHSK === '7-9' ? '7-9' : entry.level"
            />
            <div
              class="widget mt-5"
              id="search-subs"
              :key="`subs-search-${entry.id}`"
            >
              <div class="widget-title">“{{ entry.bare }}” in TV Shows</div>
              <div class="widget-body">
                <SearchSubsComp
                  v-if="entry && delayed"
                  ref="searchSubs"
                  :level="entry.newHSK && entry.newHSK === '7-9' ? '7-9' : entry.hsk"
                  :terms="
                    entry.simplified === entry.traditional
                      ? [entry.simplified]
                      : [entry.simplified, entry.traditional]
                  "
                  @loaded="searchSubsLoaded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <Concordance class="mt-5 mb-5" :word="entry" :level="entry.level" />
          </div>
        </div>

        <div class="row d-flex" style="flex-wrap: wrap">
          <EntryDifficulty :entry="entry" style="flex: 1" class="m-3" />
          <EntryDisambiguation
            :entry="entry"
            class="m-3"
            style="flex: 1; min-width: 20rem"
          ></EntryDisambiguation>
        </div>

        <div class="row">
          <div class="col-sm-12">
            <Mistakes
              class="mt-5 mb-5"
              v-if="$l2.code === 'zh'"
              :text="entry.simplified"
            ></Mistakes>
          </div>
        </div>
        <div class="row" v-if="['zh', 'ja', 'ko'].includes($l2.code)" :key="`${entry.id}-characters`">
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
                delayed &&
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
                delayed &&
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
                delayed &&
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
      <EntryCourseAd
        v-if="$l2.code === 'zh'"
        :entry="entry"
        class="focus-exclude"
      ></EntryCourseAd>
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
import SearchSubsComp from '@/components/SearchSubsComp'
import { mapState } from 'vuex'

export default {
  components: {
    SearchSubsComp,
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
      paginatorKey: 0,
      extDict: '',
      title: '',
      description: '',
      searchSubsImage: undefined,
      webImage: undefined,
      searchSubsExample: '',
      delayed: false,
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
    unbindKeys() {
      window.onkeydown = null
    },

    bindKeys() {
      window.onkeydown = (e) => {
        if (e.target.tagName.toUpperCase() !== 'INPUT' && !e.metaKey) {
          // home
          if (e.keyCode == 36) {
            document
              .getElementById('main')
              .scrollIntoView({ behavior: 'smooth' })
            // this.$refs.searchCompare.focusOnSearch()
            return false
          }
          // end
          if (e.keyCode == 35) {
            document
              .getElementById('search-subs')
              .scrollIntoView({ behavior: 'smooth' })
            return false
          }
          // left = 37
          if (e.keyCode == 37) {
            this.$refs.searchSubs.prevHit()
            return false
          }
          // right = 39
          if (e.keyCode == 39) {
            this.$refs.searchSubs.nextHit()
            return false
          }
          // up = 38
          if (e.keyCode == 38) {
            this.$refs.searchSubs.previousLine()
            return false
          }
          // down = 40
          if (e.keyCode == 40) {
            this.$refs.searchSubs.nextLine()
            return false
          }
          // r = 82
          if (e.keyCode == 82) {
            this.$refs.searchSubs.rewind()
            return false
          }
          // spacebar = 32
          if (e.keyCode == 32) {
            this.$refs.searchSubs.togglePaused()
            return false
          }
          // f = 70
          if (e.keyCode == 70) {
            this.$refs.searchSubs.toggleFullscreen()
            return false
          }
          // escape = 27
          if (e.keyCode == 27) {
            this.$refs.searchSubs.fullscreen = false
            return false
          }
          // n = 78
          if (e.keyCode == 78) {
            this.nextWord()
            document
              .getElementById('main')
              .scrollIntoView({ behavior: 'smooth' })
            return false
          }
          // p = 80
          if (e.keyCode == 80) {
            this.prevWord()
            document
              .getElementById('main')
              .scrollIntoView({ behavior: 'smooth' })
            return false
          }
        }
      }
    },
    async show(entry) {
      this.delayed = false
      this.entry = entry
      this.title = `${entry.bare} ${
        entry.pronunciation ? '(' + entry.pronunciation + ')' : ''
      } | ${this.$l2 ? this.$l2.name : ''} Zero to Hero Dictionary`
      this.description = `"${entry.bare}" means ${entry.definitions.join(
        '; '
      )}:`
      setTimeout(() => {
        if (entry.id === this.entry.id) this.delayed = true
      }, 1000)
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
    setExtDict(dict) {
      if (this.extDict === dict) {
        this.extDict = ''
      } else {
        this.extDict = dict
      }
    },
    async nextWord() {
      if (this.entry.newHSK && this.entry.newHSK.includes('7-9')) {
        let match = this.entry.newHSKMatches.find(
          (match) => match.level === '7-9'
        )
        let newEntry = await (await this.$dictionary).getByNewHSK(
          '7-9',
          Math.min(Number(match.num) + 1),
          5635
        )
        this.$router.push({
          path: `/${this.$l1.code}/${this.$l2.code}/dictionary/${this.$dictionaryName}/${newEntry.id}`,
        })
      }
    },
    async prevWord() {
      if (this.entry.newHSK && this.entry.newHSK.includes('7-9')) {
        let match = this.entry.newHSKMatches.find(
          (match) => match.level === '7-9'
        )
        let newEntry = await (await this.$dictionary).getByNewHSK(
          '7-9',
          Math.max(0, Number(match.num) - 1)
        )
        this.$router.push({
          path: `/${this.$l1.code}/${this.$l2.code}/dictionary/${this.$dictionaryName}/${newEntry.id}`,
        })
      }
    },
    async random() {
      let randomId = (await (await this.$dictionary).random()).id
      this.$router.push({
        path: `/${this.$l1.code}/${this.$l2.code}/dictionary/${this.$dictionaryName}/${randomId}`,
      })
    },
    searchSubsLoaded(hits) {
      if (hits.length > 0) {
        this.searchSubsImage = `https://img.youtube.com/vi/${hits[0].video.youtube_id}/hqdefault.jpg`
        this.searchSubsExample =
          hits[0].lineIndex > 0 ? hits[0].video.subs_l2[hits[0].lineIndex - 1].line : '' +
          ' ' +
          hits[0].video.subs_l2[hits[0].lineIndex].line
      }
    },
    webImagesLoaded(images) {
      if (images.length > 0) {
        this.webImage = images[0].src
      }
    },
  },
  metaInfo() {
    return {
      meta: [
        // Facebook OpenGraph
        { property: 'og:title', content: this.title },
        { property: 'og:site_name', content: this.$l2.name + ' Zero to Hero' },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:image',
          content:
            this.searchSubsImage ||
            this.webImage ||
            this.$languages.logo(this.$l2.code),
        },
        {
          property: 'og:description',
          content:
            this.description + ' ' + this.searchSubsExample ||
            this.entry.example ||
            '',
        },
      ],
    }
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
  activated() {
    this.bindKeys()
  },
  deactivated() {
    this.unbindKeys()
  },
  mounted() {
    if (this.$route.name === 'dictionary') {
      this.route()
      this.updateWords()
    }
  },
}
</script>

<style>
.ext-dictionary-buttons {
  display: block;
  position: sticky;
  top: 0;
  z-index: 1;
}
.ext-dictinoary-iframe {
  width: 100%;
  border: 1px solid #eee;
  height: calc(100vh - 4rem);
  border-radius: 0.5rem;
  background: #ccc;
}
</style>
