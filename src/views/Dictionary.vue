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
              :key="`search-${args}`"
            />
          </div>
        </div>
        <h2 class=" mt-5 mb-5 text-center" v-if="!entry">
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
            <div class="widget">
              <div class="p-4">
                <EntryHeader
                  :entry="entry"
                  :key="`header-${args}`"
                ></EntryHeader>
                <DefinitionsList
                  :key="`def-list-${args}`"
                  v-if="entry.definitions"
                  class="mt-4"
                  :definitions="entry.definitions"
                ></DefinitionsList>
              </div>
              <EntryExample :entry="entry" class="mb-4"></EntryExample>
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
            <EntryForms v-if="$l2.code === 'ru'" class="mt-5" :word="entry" />
            <Collocations
              class="mt-5 mb-5"
              :word="entry"
              :level="entry.level"
            />
            <div class="widget mt-5" :key="`subs-search-${entry.id}`">
              <div class="widget-title">“{{ entry.bare }}” in TV Shows</div>
              <div class="widget-body">
                <SearchSubsComp v-if="entry" :level="entry.hsk" :terms="entry.simplified === entry.traditional ? [entry.simplified] : [entry.simplified, entry.traditional]"  class="mt-4 mb-4" @loaded="searchSubsLoaded" />
                <p class="mt-1 text-center" v-if="youglishLang[$l2.code]">
                  See examples of “{{ entry.bare }}” on
                  <a
                    :href="`https://youglish.com/pronounce/${entry.bare}/${
                      youglishLang[$l2.code]
                    }`"
                    target="youglish"
                    >YouGlish</a>
                </p>
              </div>
            </div>
            <EntryRelated :entry="entry" class="mt-5" :key="`related-${entry.id}`" />
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
          <div class="row">
            <div class="col-sm-12">
              <EntryYouTube :text="entry.bare" class="mb-5" />
            </div>
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
      youglishLang: {
        zh: 'chinese',
        en: 'english',
        ar: 'arabic',
        nl: 'dutch',
        fr: 'french',
        de: 'german',
        he: 'hebrew',
        it: 'italian',
        ja: 'japanese',
        ko: 'korean',
        pl: 'polish',
        pt: 'portuguese',
        ru: 'russian',
        es: 'spanish',
        tr: 'turkish',
      },
      title: '',
      description: '',
      searchSubsImage: undefined,
      webImage: undefined,
      searchSubsExample: ''
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
    async show(entry) {
      this.entry = entry
      this.title = `${entry.bare} ${entry.pronunciation ? '(' + entry.pronunciation + ')': ''} | ${
        this.$l2 ? this.$l2.name : ''
      } Zero to Hero Dictionary`
      this.description = `"${entry.bare}" means ${entry.definitions.join('; ')}:`
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
      this.$router.push({
        path: `/${this.$l1.code}/${this.$l2.code}/dictionary/${this.$dictionaryName}/${randomId}`,
      })
    },
    searchSubsLoaded(hits) {
      if (hits.length > 0) {
        this.searchSubsImage = `https://img.youtube.com/vi/${hits[0].video.youtube_id}/hqdefault.jpg`
        this.searchSubsExample = hits[0].video.subs_l2[hits[0].lineIndex - 1].line + ' ' + hits[0].video.subs_l2[hits[0].lineIndex].line
      }
    },
    webImagesLoaded(images) {
      if (images.length > 0) {
        this.webImage = images[0].src
      }

    }
  },
  metaInfo() {
    return {
      meta: [
          // Facebook OpenGraph
          {property: 'og:title', content: this.title},
          {property: 'og:site_name', content: this.$l2.name + ' Zero to Hero'},
          {property: 'og:type', content: 'website'},
          {property: 'og:image', content:  this.searchSubsImage || this.webImage || this.$languages.logo(this.$l2.code)},
          {property: 'og:description', content: this.description + ' ' + this.searchSubsExample || this.entry.example || ''}
      ]
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
  mounted() {
    if (this.$route.name === 'dictionary') {
      this.route()
      this.updateWords()
    }
  },
}
</script>

<style></style>
