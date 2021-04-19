<template>
  <div class="definitions-list">
    <template v-if="definitions && definitions.length > 0">
      <ul class="definitions collapsed mb-2 list-unstyled" data-collapse-target>
        <li
          v-for="(definition, index) in definitions"
          class="definition-list-item"
        >
          {{ definition.text ? definition.text : definition
          }}<span v-if="index < definitions.length - 1">;</span>
        </li>
      </ul>
    </template>
    <template v-else>
      <div class="l1">{{ nodef }}</div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    definitions: Array,
    nodef: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss">
.definition-list-item {
  display: inline;
  font-size: 1.1rem;
  font-style: italic;
}
</style>
