<template>
  <div>
    <div v-if="!resources || resources.length === 0">
      <div class="jumbotron shadow rounded bg-white">
        <p class="lead text-center mb-3">No resource is found in this category. Why not add your own here?</p>
        <div class="text-center">
          <a :href="`#/${$l1.code}/${$l2.code}/contact-us`" class="btn btn-success">Contact Us</a>
        </div>
      </div>
    </div>
    <div v-else class="resources">
      <div v-for="resource of resources" class="resource media rounded shadow">
        <a :href="resource.url" class="link-unstyled">
          <img :src="resource.thumbnail.data.full_url" class="resource-thumbnail img-fluid" />
          <div class="media-body">
            <h6>
              <Annotate>
                <span>{{ resource.title }}</span>
              </Annotate>
            </h6>
            <div>{{ resource.description }}</div>
          </div>
        </a>
      </div>
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
}
</style>
