<template>
  <div class="resources">
    <div v-for="resource of resources" class="resource media rounded shadow">
      <a :href="resource.url" class="link-unstyled">
        <img :src="resource.thumbnail.data.full_url" class="resource-thumbnail img-fluid" />
        <div class="media-body">
          <h6><Annotate><span>{{ resource.title }}</span></Annotate></h6>
          <div>{{ resource.description }}</div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    resources: {
      type: Array
    }
  }
}
</script>

<style lang="scss">
.resources {
  display: flex;
  flex-wrap: wrap;
}
.resource {
  min-width: 15rem;
  flex: 1;
  margin: 1rem;
}

</style>
