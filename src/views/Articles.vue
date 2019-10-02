<template>
  <div class="main mt-5 mb-5">
    <div
      v-if="method === 'list' && articles && articles.length > 0"
      class="container"
    >
      <div class="row">
        <div class="col-sm-12 col-md-8">
          <h3 class="mb-5">Wiki Articles</h3>
          <ArticlesList :articles="articles" />
        </div>
        <div class="col-sm-12 col-md-4">
          <h4 class="mb-5">About the Wiki</h4>
          <p>These are user-contributed articles to help you learn {{ $l2.name}}.</p>
          <hr />
          <p v-if="$l2.code === 'zh'">
            The previous version of the wiki can be viewed
            <a href="http://wiki.chinesezerotohero.com"
              >here</a>.
          </p>
        </div>
      </div>
    </div>
    <div v-if="method === 'view' && article" class="container">
      <div class="row">
        <div class="col-sm-12">
          <ArticleCard :article="article" :edit="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Config from '@/lib/config'
import ArticlesList from '@/components/ArticlesList.vue'
import ArticleCard from '@/components/ArticleCard.vue'

export default {
  components: {
    ArticlesList,
    ArticleCard
  },
  data() {
    return {
      articles: [],
      article: undefined,
      method: undefined,
      args: undefined,
      Config
    }
  },
  watch: {
    $route() {
      if (this.$route.name === 'articles-wiki') {
        this.route()
      }
    }
  },
  methods: {
    route() {
      if (this.$route.params.method) {
        this.method = this.$route.params.method
        if (this.method === 'list') {
          this.articles = []
          $.getJSON(`${Config.wiki}items/articles`, response => {
            this.articles = response.data.map(article => {
              article.url = `#/${this.$l1.code}/${this.$l2.code}/articles/wiki/view/${
                article.id
              },${encodeURIComponent(article.title)}`
              return article
            })
          })
        } else if (this.method === 'view' && this.$route.params.args) {
          this.args = this.$route.params.args.split(',')
          this.article = undefined
          $.getJSON(
            `${Config.wiki}items/articles/${this.args[0]}`,
            response => {
              this.article = response.data
            }
          )
        }
      } else {
        location.hash = `#/${this.$l1.code}/${this.$l2.code}/articles/wiki/list`
      }
    }
  },
  created() {
    this.route()
  }
}
</script>

<style>
</style>
