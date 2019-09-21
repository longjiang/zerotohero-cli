<template>
  <div>
    <div v-if="definitions && definitions.length > 0">
      <ul class="definitions collapsed mb-2 list-unstyled" data-collapse-target>
        <li v-for="definition in definitions" class="definition-list-item">
          {{ definition.text ? definition.text : definition }}
        </li>
      </ul>
      <ShowMoreButton
        :length="definitions.length"
        :min="3"
        class="focus-exclude"
      />
    </div>
    <div class="l1" v-else>{{ nodef }}</div>
  </div>
</template>

<script>
export default {
  props: {
    definitions: Array,
    nodef: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.definition-list-item {
  font-size: 1.1rem;
  font-style: italic;
}
</style>
