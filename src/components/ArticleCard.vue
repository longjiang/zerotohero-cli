<template>
  <article class="updown article media">
    <img
      v-if="article.thumbnail && article.thumbnail.startsWith('http')"
      :src="article.thumbnail"
      class="mr-2"
    />
    <div class="media-body">
      <Annotate tag="h5" class="article-title"  :showTranslate="true">
        <span>{{ article.title }}</span>
      </Annotate>
      <Annotate tag="div" class="article-body" :showTranslate="true">
        <div v-html="article.body" />
      </Annotate>
      <a
        v-if="edit"
        :href="`${Config.wikiAdmin}collections/articles/${article.id}`"
        class="btn article-edit-btn"
        target="_blank"
        >Edit</a
      >
    </div>
  </article>
</template>

<script>
import Config from '@/lib/config'
export default {
  props: ['article', 'edit'],
  data() {
    return {
      Config
    }
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
  background: #cecece;
  color: white;
}

a.article-edit-btn:hover {
  background: #fd4f1c;
  color: white;
}

</style>
