<template>
  <div class="container mt-5 mb-5">
    <ReleaseScheduleEnZh v-if="$l1.code === 'en' && $l2.code === 'zh'" />
    <ReleaseScheduleZhEn v-if="$l1.code === 'zh' && $l2.code === 'en'" />
  </div>
</template>

<script>
import ReleaseScheduleEnZh from '@/components/ReleaseScheduleEnZh'
import ReleaseScheduleZhEn from '@/components/ReleaseScheduleZhEn'

export default {
  components: {
    ReleaseScheduleEnZh,
    ReleaseScheduleZhEn
  }
}
</script>


<style>
</style>
