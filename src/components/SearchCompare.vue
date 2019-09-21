<template>
  <div class="search-compare-wrapper" v-if="!loading">
    <Search ref="search" random="true" :entry="searchEntry" :placeholder="$t('Look up words here...')"></Search>
    <Search
      :class="{ 'ml-2': true, hidden: !dCompare }"
      :entry="compareEntry"
      ref="compare"
      placeholder="Compare with..."
      :hrefFunc="compareHrefFunc"
    ></Search>
  </div>
</template>

<script>
import Helper from '@/lib/helper'
import Search from '@/components/Search'

export default {
  props: {
    searchEntry: {
      default: undefined
    },
    compareEntry: {
      default: undefined
    },
    compare: {
      default: false
    }
  },
  components: {
    Search
  },
  data() {
    return {
      Helper,
      Search,
      loading: true,
      dCompare: this.compare,
      compareHrefFunc: compareEntry => {
        const entry = this.$refs.search.entry || this.entry
        return `#/compare/cedict/${entry.identifier},${compareEntry.identifier}`
      }
    }
  },
  async mounted() {
    await this.$dictionary
    this.loading = false
  },
  methods: {
    compareClick() {
      this.dCompare = this.dCompare ? false : true
    }
  }
}
</script>

<style>

.search-compare-wrapper {
  display: flex;
  position: relative;
  max-width: 50rem;
  margin: 0 auto;
}

.search-compare-wrapper .search-wrapper {
  flex: 1;
}

.search-compare-wrapper .input-group > * {
  height: 2.3rem;
}

.btn-random {
  position: absolute;
  right: 3rem;
  font-size: 0.8rem;
  line-height: 0.8rem;
  height: 1.7rem !important;
  top: 0.3rem;
  background: #cacaca;
  border: none;
}

@media (max-width: 480px) {
  .compare-btn-text {
    display: none;
  }
}


@media (max-width: 768px) {
  .btn-random span {
    display: none;
  }
}

.btn-compare {
  color: #fd4f1c;
}

.btn-compare:hover {
  color: white;
  background: #fd4f1c;
}</style>
