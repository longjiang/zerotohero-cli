<template>
  <div class="container main pt-5 pb-5" id="book-chapter">
    <div class="row mb-5">
      <div class="col-sm-12">
        <SimpleSearch
          placeholder="Enter the URL of a book chapter from a variety of eBook websites"
          :action="
            url => {
              location.hash = `#/${$lang.code}/book/chapter/${encodeURIComponent(url)}`
            }
          "
          ref="search"
        />
      </div>
    </div>
    <div class="row">
      <div
        class="col-md-8"
        :key="'chapter-' + encodeURIComponent(chapterTitle)"
      >
        <div
          v-if="!(chapterContent && chapterContent.length > 0)"
          class="text-center"
        >
          <Loader :sticky="true" />
        </div>
        <Annotate tag="h1"
          ><span>{{ chapterTitle }}</span></Annotate
        >
        <div class="chapter-content" v-if="chapterContent">
          <SpeechBar
            :html="
              chapterContent.replace(
                /href=&quot;([^&quot;]+)&quot;/g,
                (match, p1) =>
                  `href=&quot;#/${$lang.code}/book/chapter/${encodeURIComponent(p1)}&quot;`
              )
            "
          />
        </div>
        <b-button-group class="d-flex mb-5">
          <b-button variant="light" v-if="previous" @click="previousClick">
            <i class="fas fachevron-up mr-2"></i>Previous
          </b-button>
          <b-button variant="light" v-if="next" @click="nextClick">
            Next
            <i class="fas fachevron-down ml-2"></i>
          </b-button>
        </b-button-group>
      </div>
      <div class="col-md-4 text-center" :key="'book-' + bookTitle">
        <a
          :href="
            bookURL ? `#/${$lang.code}/book/index/${encodeURIComponent(bookURL)}` : false
          "
          class="link-unstyled"
        >
          <img
            :src="
              bookThumbnail
                ? `${Config.imageProxy}?${bookThumbnail}`
                : `/img/book-thumb-${Math.floor(Math.random() * 10)}.jpg`
            "
            alt="Book cover"
            class="mb-4 shadow book-thumb"
          />
          <Annotate v-if="bookTitle">
            <h6>
              <em>{{ bookTitle }}</em>
            </h6>
            <p>{{ bookAuthor }}</p>
          </Annotate>
        </a>
        <div class="bg-light p-4 mb-3 rounded" v-if="Library.source(args)">
          <a :href="args" class="link-unstyled" target="_blank">
            Read the original on
            <img
              class="logo-small ml-2"
              :src="Library.source(args).logo"
              :alt="Library.source(args).name"
            />
          </a>
        </div>
        <b-button-group class="d-flex mb-3">
          <b-button variant="light" v-if="previous" @click="previousClick">
            <i class="fas fachevron-up mr-2"></i>
          </b-button>
          <b-button variant="light" v-if="next" @click="nextClick">
            <i class="fas fachevron-down ml-2"></i>
          </b-button>
        </b-button-group>
        <div class="list-group text-left">
          <Annotate
            tag="a"
            v-for="chapter in chapters"
            :class="{
              'list-group-item': true,
              'link-unstyled': true,
              active:
                location.hash ===
                `#/${$lang.code}/book/chapter/${encodeURIComponent(chapter.url)}`
            }"
            :href="`#/${$lang.code}/book/chapter/${encodeURIComponent(chapter.url)}`"
            ><span>{{ chapter.title }}</span></Annotate
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Config from '@/lib/config'
import Library from '@/lib/library'
import SimpleSearch from '@/components/SimpleSearch'
import SpeechBar from '@/components/SpeechBar'

export default {
  props: {
    method: {
      type: String
    },
    args: {
      type: String
    }
  },
  components: {
    SimpleSearch,
    SpeechBar
  },
  data() {
    return {
      Config,
      Library,
      bookThumbnail: undefined,
      bookTitle: '',
      bookAuthor: '',
      bookURL: '',
      chapters: [],
      chapterTitle: '',
      chapterContent: '',
      location
    }
  },
  watch: {
    args() {
      this.updateURL()
    }
  },
  computed: {
    previous() {
      if (this.chapters) {
        let index = this.chapters.findIndex(
          chapter => chapter.url === this.args
        )
        if (index && index > 0 && this.chapters[index - 1]) {
          return this.chapters[index - 1].url
        } else {
          return false
        }
      } else {
        return false
      }
    },
    next() {
      let next = false
      if (this.chapters) {
        let index = this.chapters.findIndex(
          chapter => chapter.url === this.args
        )
        if (
          index !== undefined &&
          index < this.chapters.length - 1 &&
          this.chapters[index + 1]
        ) {
          next = this.chapters[index + 1].url
        }
      }
      return next
    }
  },
  methods: {
    async updateURL() {
      let url = decodeURIComponent(this.args)
      this.$refs.search.text = url
      this.chapterTitle = ''
      this.chapterContent = ''
      if(this.$lang.options.library && this.$lang.options.library.sources) {
        await Library.setLangSources(this.$lang.options.library.sources)
      }
      let chapter = await Library.getChapter(url)
      if (chapter) {
        this.chapterTitle = chapter.title
        this.chapterContent = chapter.content
        if (chapter.book) {
          this.chapters = chapter.book.chapters
          this.bookThumbnail = chapter.book.thumbnail
          this.bookTitle = chapter.book.title
          this.bookAuthor = chapter.book.author
          this.bookURL = chapter.book.url
        }
      }
    },
    previousClick() {
      location.hash = `#/${this.$lang.code}/book/chapter/${encodeURIComponent(this.previous)}`
    },
    nextClick() {
      location.hash = `#/${this.$lang.code}/book/chapter/${encodeURIComponent(this.next)}`
    }
  },
  async mounted() {
    this.updateURL()
  }
}
</script>

<style lang="scss">
.chapter-content {
  img {
    max-width: 100%;
    height: auto;
  }
}
</style>
