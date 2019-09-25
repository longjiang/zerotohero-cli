<template>
  <div class="container mt-5 mb-5">
    <div v-if="$l1.code === 'en' && $l2.code === 'zh'">
      <PricingEnZh />
    </div>
    <div v-if="$l1.code === 'zh' && $l2.code === 'en'">
      <PricingZhEn />
    </div>
  </div>
</template>

<script>
import PricingZhEn from '@/components/PricingZhEn'
import PricingEnZh from '@/components/PricingEnZh'
export default {
  components: {
    PricingZhEn,
    PricingEnZh
  }
}
</script>

<style>
.sale-price {
  color: red;
}
.pricing-table td:first-child,
.pricing-table th:first-child {
  font-weight: bold;
  max-width: 10rem;
}

.pricing-table a,
.pricing-table a:hover {
  color: white;
}
</style>
