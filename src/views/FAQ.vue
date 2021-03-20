<template>
  <div class="faq container mt-5 mb-5">
    <div class="row" v-if="$l1.code === 'en' && $l2.code === 'zh'">
      <FAQEnZh />
    </div>
    <div class="row" v-if="$l1.code === 'zh' && $l2.code === 'en'">
      <FAQZhEn />
    </div>
  </div>
</template>


<script>
import FAQZhEn from '@/components/FAQZhEn'
import FAQEnZh from '@/components/FAQEnZh'

export default {
  components: {
    FAQZhEn,
    FAQEnZh
  }
}
</script>

<style>
</style>
