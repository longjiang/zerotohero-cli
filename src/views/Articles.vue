<template>
  <div class="main mt-5 mb-5">
    <div
      v-if="method === 'list' && articles && articles.length > 0"
      class="container"
    >
      <div class="row">
        <div class="col-sm-12 col-md-8">
          <h3 class="mb-5">Wiki Articles</h3>
          <ArticlesList :articles="articles" :edit="true" />
        </div>
        <div class="col-sm-12 col-md-4">
          <h4 class="mb-5">About the Wiki</h4>
          <hr />
          <p>
            The Chinese Learning Wiki has been around since mid-2018. We are
            breathing it with new life by merging it with the new Dictionary so
            it can take advantage of all the features in the dictionary, such as
            pinyin annotation, dictionary lookup, word-saving, etc.
          </p>
          <p>
            The previous version of the wiki can be viewed
            <a href="http://wiki.chinesezerotohero.com"
              >here <i class="glyphicon glyphicon-new-window"></i> </a
            >.
          </p>
          <p>Thanks for using the Wiki and the Dictionary!</p>
          <p class="text-right">— Jon, Chinese Zero to Hero</p>
        </div>
      </div>
    </div>
    <div v-if="method === 'view' && article" class="container">
      <div class="row">
        <div class="col-sm-12">
          <ArticleCard :article="article" />
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
              article.url = `#/articles/wiki/view/${
                article.id
              },encodeURIComponent(${article.title})`
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
        location.hash = '#/articles/wiki/list'
      }
    }
  },
  created() {
    this.route()
  }
}
</script>

<style>
.article {
  list-style: none;
  margin-bottom: 1rem;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  overflow: hidden;
}

.article-title {
  border-bottom: 1px solid #ececec;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  color: #fd4f1c;
}

.article-list-item .article-body {
  font-size: 1rem;
}

.article-list-item.collapsed .article-body {
  max-height: 10rem;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(180deg, #000 60%, transparent);
  mask-image: linear-gradient(180deg, #000 60%, transparent);
}

.article-list-item a {
  color: inherit;
}

.article-list-item a:hover {
  color: inherit;
  text-decoration: none;
}

.article-body img {
  display: none;
}

a.article-edit-btn {
  float: right;
  background: #cecece;
  color: white;
}

a.article-edit-btn:hover {
  float: right;
  background: #fd4f1c;
  color: white;
}
</style>
