<template>
  <div>
    <div class="resource media rounded shadow">
      <a :href="resource.url" :target="internal ? '_self' : '_blank'" class="link-unstyled">
        <img :src="resource.thumbnail" class="resource-thumbnail img-fluid" />
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
</template>

<script>
export default {
  props: [ 'resource', 'internal' ]
}
</script>

<style>
.resource-thumbnail {
  width: 100%;
}
</style>