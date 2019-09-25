<template>
  <div class="main mt-5 mb-5">
    <div v-if="method === 'list'" class="container">
      <div class="row">
        <div class="col-sm-12">
          <h3>
            Chinese Learning Resources
          </h3>
          <hr>
          <p class="mb-5">
            This is a collection of Chinese-learning resources contributed by
            users over Reddit.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-4">
          <div class="list-group">
            <a class="list-group-item list-group-item-action active">All</a>
            <a class="list-group-item">Courses</a>
            <a class="list-group-item">Tutoring</a>
            <a class="list-group-item">Dictionaries</a>
            <a class="list-group-item">Flashcard</a>
            <a class="list-group-item">Books (Readers)</a>
          </div>
        </div>
        <div class="col-sm-12 col-md-8">
          <RedditArticlesList path="r/ChineseLanguage/top" />
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
      if (this.$route.name === 'resources') {
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
        location.hash = '#/resources/list'
      }
    }
  },
  created() {
    this.route()
  }
}
</script>

<style></style>
