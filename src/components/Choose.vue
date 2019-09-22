<template>
  <div>
    <h6 class="mb-4 text-white">Learn various languages through English:</h6>
    <div class="zerotohero">
      <LanguageLogo
        class="zerotohero-item"
        v-for="language in $languages.l1s.sort((a,b) => b.name > a.name ? -1 : 0)"
        :l1="$languages.get('eng')"
        :l2="language"
      />
    </div>
    <hr class="border-light" style="opacity: 0.5" />
    <h6 class="mt-4 mb-4 text-white">Learn English through various languages:</h6>
    <div class="zerotohero">
      <LanguageLogo
        class="zerotohero-item"
        v-for="language in $languages.l1s.filter(language => language.translations).sort((a,b) => b.name > a.name ? -1 : 0)"
        :l1="language"
        :l2="$languages.get('eng')"
      />
    </div>
  </div>
</template>

<script>
import LanguageLogo from '@/components/LanguageLogo'

export default {
  components: {
    LanguageLogo
  },
  data() {
    return {}
  }
}
</script>

<style>
</style>