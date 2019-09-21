<template>
  <div class="container main pt-5 pb-5" id="book-list">
    <h1 class="mb-5">Book List</h1>
    <SimpleSearch
      placeholder="Enter the URL of a book list from a variety of eBook websites"
      :action="
        url => {
          location.hash = `#/${this.$lang.code}/book/list/${encodeURIComponent(url)}`
        }
      "
      ref="search"
      class="mb-5"
    />
    <ul class="list-unstyled booklist">
      <li v-for="book in booklist" class="booklist-item text-center">
        <a :href="`#/${$lang.code}/book/index/${encodeURIComponent(book.url)}`" class="link-unstyled">
          <img
            :src="
              book.thumbnail
                ? `${Config.imageProxy}?${book.thumbnail}`
                : `/img/book-thumb-${Math.floor(Math.random() * 10)}.jpg`
            "
            alt="Book cover"
            class="mb-4 shadow book-thumb"
          />
          <Annotate tag="h6">
            <b>{{ book.title }}</b>
          </Annotate>
          <Annotate tag="small" v-if="book.author">
            <span>{{ book.author }}</span>
          </Annotate>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import Config from '@/lib/config'
import Library from '@/lib/library'
import SimpleSearch from '@/components/SimpleSearch'

export default {
  props: {
    args: {
      type: String
    },
    method: {
      type: String
    }
  },
  components: {
    SimpleSearch
  },
  data() {
    return {
      Config,
      location,
      booklist: []
    }
  },
  watch: {
    args() {
      this.updateURL()
    }
  },
  methods: {
    async updateURL() {
      let url = decodeURIComponent(this.args)
      this.$refs.search.text = url
      this.booklist = []
      this.booklist = await Library.getBooklist(url, this.$lang.code)
    }
  },
  async mounted() {
    this.updateURL()
  }
}
</script>
