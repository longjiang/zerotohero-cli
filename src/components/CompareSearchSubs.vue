<template>
  <div>
    <div class="text-center">
      <b-button class="mr-2 btn btn-small" :data-bg-level="levelA"  @click="hitAB = 'A'">{{ termsA[0] }}</b-button>
      <b-button class="btn btn-small" :data-bg-level="levelB" @click="hitAB = 'B'">{{ termsB[0] }}</b-button>
    </div>
    <SearchSubsComp :class="{'d-none': hitAB === 'B'}" ref="searchSubsA" :level="levelA" :terms="termsA" :key="`subs-search-${termsA[0]}`" />
    <SearchSubsComp :class="{'d-none': hitAB === 'A'}" ref="searchSubsB" :level="levelB" :terms="termsB" :key="`subs-search-${termsB[0]}`" />
  </div>
</template>

<script>
import SearchSubsComp from '@/components/SearchSubsComp'

export default {
  components: {
    SearchSubsComp,
  },
  props: {
    termsA: {
      type: Array,
    },
    levelA: {
      type: String,
    },
    termsB: {
      type: Array,
    },
    levelB: {
      type: String,
    },
  },
  data() {
    return {
      hitAB: 'A',
      hitIndexA: 0,
      hitIndexB: 0
    }
  },
  methods: {},
}
</script>