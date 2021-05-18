<template>
  <div>
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
                :key="`header-${entry.id}`"
                @prevWord="prevWord()"
                @nextWord="nextWord()"
              ></EntryHeader>
              <DefinitionsList
                :key="`def-list-${entry.id}`"
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
            <div>
              <div class="ext-dictionary-buttons p-2 bg-white">
                <b-button
                  @click="setExtDict('zdic')"
                  v-if="['zh', 'yue', 'nan', 'wuu', 'hak'].includes($l2.code)"
                  class="mr-2 btn btn-small"
                  :data-bg-level="extDict === 'zdic' ? entry.level : false"
                  >汉典</b-button
                >
                <b-button
                  @click="setExtDict('wiktionary')"
                  class="mr-2 btn btn-small"
                  :data-bg-level="
                    extDict === 'wiktionary' ? entry.level : false
                  "
                  >Wiktionary</b-button
                >
                <b-button
                  @click="setExtDict('etymology')"
                  v-if="$l2.code === 'en'"
                  class="mr-2 btn btn-small"
                  :data-bg-level="extDict === 'etymology' ? entry.level : false"
                  >Etymology</b-button
                >
                <b-button
                  @click="setExtDict('ngram')"
                  v-if="$l2.code === 'en'"
                  class="mr-2 btn btn-small"
                  :data-bg-level="extDict === 'ngram' ? entry.level : false"
                  >Ngram</b-button
                >
                <b-button
                  @click="setExtDict('cambridge')"
                  v-if="$l2.code === 'en'"
                  class="mr-2 btn btn-small"
                  :data-bg-level="extDict === 'cambridge' ? entry.level : false"
                  >Cambridge</b-button
                >
                <b-button
                  @click="setExtDict('moedict')"
                  v-if="['zh', 'yue', 'nan', 'wuu', 'hak'].includes($l2.code)"
                  class="mr-2 btn btn-small"
                  :data-bg-level="extDict === 'moedict' ? entry.level : false"
                  >萌典</b-button
                >
                <b-button
                  @click="setExtDict('baidu-baike')"
                  v-if="$l2.code === 'zh'"
                  class="mr-2 btn btn-small"
                  :data-bg-level="
                    extDict === 'baidu-baike' ? entry.level : false
                  "
                  >百度百科</b-button
                >
                <b-button
                  @click="setExtDict('naver')"
                  v-if="['zh', 'ko', 'ja'].includes($l2.code)"
                  class="mr-2 btn btn-small"
                  :data-bg-level="extDict === 'naver' ? entry.level : false"
                  >Naver</b-button
                >
                <b-button
                  @click="setExtDict('grammar-wiki')"
                  class="mr-2 btn btn-small"
                  v-if="$l2.code === 'zh'"
                  :data-bg-level="
                    extDict === 'grammar-wiki' ? entry.level : false
                  "
                  >Grammar Wiki</b-button
                >
              </div>
              <div class="mb-4 pl-2 pr-2">
                <iframe
                  v-if="extDict === 'ngram'"
                  :src="`https://books.google.com/ngrams/graph?content=${entry.bare}&year_start=1800&year_end=2019&corpus=26&smoothing=3`"
                  class="ext-dictinoary-iframe"
                ></iframe>
                <iframe
                  v-if="extDict === 'zdic'"
                  :src="`https://www.zdic.net/hans/${entry.simplified}`"
                  class="ext-dictinoary-iframe"
                ></iframe>
                <iframe
                  v-if="extDict === 'wiktionary'"
                  :src="`https://en.wiktionary.org/wiki/${entry.bare}`"
                  class="ext-dictinoary-iframe"
                ></iframe>
                <iframe
                  v-if="extDict === 'etymology'"
                  :src="`https://www.etymonline.com/word/${entry.bare}`"
                  class="ext-dictinoary-iframe"
                ></iframe>
                <iframe
                  v-if="extDict === 'cambridge'"
                  :src="`https://dictionary.cambridge.org/dictionary/english-chinese-simplified/${entry.bare}`"
                  class="ext-dictinoary-iframe"
                ></iframe>
                <iframe
                  v-if="extDict === 'moedict'"
                  :src="`https://www.moedict.tw/${entry.traditional}`"
                  class="ext-dictinoary-iframe"
                ></iframe>
                <iframe
                  v-if="extDict === 'baidu-baike'"
                  :src="`https://baike.baidu.com/item/${entry.simplified}`"
                  class="ext-dictinoary-iframe"
                ></iframe>
                <iframe
                  v-if="extDict === 'naver'"
                  :src="`https://korean.dict.naver.com/ko${$l2.code}dict/chinese/#/search?query=${entry.bare}`"
                  class="ext-dictinoary-iframe"
                ></iframe>
                <iframe
                  v-if="extDict === 'grammar-wiki'"
                  :src="`https://resources.allsetlearning.com/gramwiki/?search=${entry.simplified}`"
                  class="ext-dictinoary-iframe"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row d-flex" style="flex-wrap: wrap">
        <!-- <EntryDifficulty :entry="entry" style="flex: 1" class="m-3" /> -->
        <EntryDisambiguation
          v-if="['zh', 'yue'].includes($l2.code)"
          :entry="entry"
          class="m-3"
          style="flex: 1; min-width: 20rem"
        ></EntryDisambiguation>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <WebImages
            v-if="showImages"
            class="mt-5"
            :text="entry.bare"
            :entry="entry"
            limit="10"
            ref="images"
            @loaded="webImagesLoaded"
          />
          <EntryForms v-if="$l2.code === 'ru'" class="mt-5" :word="entry" />
          <Collocations
            v-if="$l2.code !== 'ja'"
            :class="{ 'mt-5 mb-5': true, hidden: !collocationsReady }"
            :word="entry"
            @collocationsReady="collocationsReady = true"
            :level="
              entry.newHSK && entry.newHSK === '7-9' ? '7-9' : entry.level
            "
          />
          <div
            :class="{'widget mt-5': true, hidden: !searchSubsReady}"
            id="search-subs"
            v-if="entry && showSearchSubs"
            :key="`subs-search-${entry.id}`"
          >
            <div class="widget-title">“{{ entry.bare }}” in TV Shows</div>
            <div class="widget-body">
              <SearchSubsComp
                ref="searchSubs"
                :level="
                  entry.newHSK && entry.newHSK === '7-9' ? '7-9' : entry.hsk
                "
                :terms="
                  $l2.code === 'zh'
                    ? entry.simplified === entry.traditional
                      ? [entry.simplified]
                      : [entry.simplified, entry.traditional]
                    : entry.forms && entry.forms.length > 0
                    ? entry.forms
                    : [entry.bare]
                "
                @loaded="searchSubsLoaded"
              />
            </div>
          </div>
          <Mistakes
            :class="{ 'mt-5 mb-5': true, hidden: !mistakesReady }"
            @mistakesReady="mistakesReady = true"
            v-if="$l2.code === 'zh'"
            :text="entry.simplified"
          ></Mistakes>
          <EntryRelated
            :class="{ 'mt-5': true, hidden: !relatedReady }"
            @relatedReady="relatedReady = true"
            :entry="entry"
            :key="`related-${entry.id}`"
          />
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <Concordance
            :class="{ 'mt-5 mb-5': true, hidden: !concordanceReady }"
            @concordanceReady="concordanceReady = true"
            :word="entry"
            :level="entry.level"
          />
        </div>
      </div>
      <div
        class="row  mt-5"
        v-if="['zh', 'ja', 'ko'].includes($l2.code)"
        :key="`${entry.id}-characters`"
      >
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
</template>
<script>
import Concordance from '@/components/Concordance.vue'
import Collocations from '@/components/Collocations.vue'
import EntryHeader from '@/components/EntryHeader.vue'
import WebImages from '@/components/WebImages.vue'
import DefinitionsList from '@/components/DefinitionsList'
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
export default {
  components: {
    EntryExample,
    EntryDifficulty,
    EntryDisambiguation,
    Chinese,
    Japanese,
    Korean,
    EntryForms,
    Collocations,
    SearchSubsComp,
    Concordance,
    EntryHeader,
    DefinitionsList,
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
    entry: {
      type: Object,
    },
    showImages: {
      default: true,
    },
    showSearchSubs: {
      default: true,
    },
  },
  data() {
    return {
      characters: [],
      character: {},
      unsplashSrcs: [],
      unsplashSearchTerm: '',
      extDict: '',
      searchSubsImage: undefined,
      webImage: undefined,
      searchSubsExample: '',
      delayed: false,
      collocationsReady: false,
      mistakesReady: false,
      relatedReady: false,
      concordanceReady: false,
      searchSubsReady: false
    }
  },
  mounted() {},
  updated() {},
  methods: {
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
    setExtDict(dict) {
      if (this.extDict === dict) {
        this.extDict = ''
      } else {
        this.extDict = dict
      }
    },
    searchSubsLoaded(hits) {
      if (hits.length > 0) {
        this.searchSubsReady = true
        this.searchSubsImage = `https://img.youtube.com/vi/${hits[0].video.youtube_id}/hqdefault.jpg`
        this.searchSubsExample =
          hits[0].lineIndex > 0
            ? hits[0].video.subs_l2[hits[0].lineIndex - 1].line
            : '' + ' ' + hits[0].video.subs_l2[hits[0].lineIndex].line
      }
    },
    webImagesLoaded(images) {
      if (images.length > 0) {
        this.webImage = images[0].src
      }
    },
  },
}
</script>
<style lang="scss" scoped>
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
  background: #eee;
}
</style>
