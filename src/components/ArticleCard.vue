<template>
  <article class="updown article media">
    <img
      v-if="article.thumbnail && article.thumbnail.startsWith('http')"
      :src="article.thumbnail"
      class="mr-2"
    />
    <div class="media-body">
      <Annotate tag="h5" class="article-title">
        {{ article.title }}
        <a
          v-if="edit"
          :href="`${Config.wikiAdmin}collections/articles/${article.id}`"
          class="btn article-edit-btn"
          target="_blank"
          >Edit</a
        >
      </Annotate>
      <Annotate tag="div" v-html="article.body" class="article-body"></Annotate>
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

<style></style>
