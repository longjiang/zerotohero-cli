<template>
  <div class="main mt-5 mb-5">
    <div
      v-if="method === 'list'"
      class="container"
    >
      <div class="row">
        <div class="col-sm-12 col-md-8">
          <h3 class="mb-5">
            Reddit Posts under
            <a href="https://www.reddit.com/r/ChineseLanguage"
              >r/ChineseLanguage</a
            >
          </h3>
          <RedditArticlesList path="r/ChineseLanguage/top" />
        </div>
        <div class="col-sm-12 col-md-4">
          <h4 class="mb-5">About Reddit</h4>
          <hr />
          <p>
            This is a community for people studying or teaching Chinese - or
            just interested in the language. Please post interesting links,
            language learning advice, or questions about the Chinese language.
            To participate and create new content,
            <a href="https://www.reddit.com/r/ChineseLanguage/"
              >visit the community on Reddit</a
            >.
          </p>
        </div>
      </div>
    </div>
    <div v-if="method === 'view' && articleId" class="container">
      <div class="row">
        <div class="col-sm-12">
          <RedditArticle v-if="articleId" :articleId="articleId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Config from '@/lib/config'
import Helper from '@/lib/helper'
import RedditArticlesList from '@/components/RedditArticlesList.vue'
import RedditArticle from '@/components/RedditArticle.vue'

export default {
  components: {
    RedditArticlesList,
    RedditArticle
  },
  props: ['method', 'args'],
  data() {
    return {
      articles: [],
      articleId: undefined,
      Config,
      Helper
    }
  },
  watch: {
    $route() {
      if (this.$route.name === 'articles-reddit') {
        this.route()
      }
    }
  },
  methods: {
    route() {
      if (this.method) {
        if (this.method === 'view' && this.args) {
          this.articleId = this.args.split(',')[0]
        }
      } else {
        location.hash = '#/articles/reddit/list'
      }
    }
  },
  created() {
    this.route()
  }
}
</script>

<style></style>
