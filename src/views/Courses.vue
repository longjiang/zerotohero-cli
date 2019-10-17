<template>
  <div>
    <CoursesZh v-if="$l1.code === 'en' && $l2.code === 'zh'" />
    <CoursesEn v-if="$l1.code === 'zh' && $l2.code === 'en'" />
  </div>
</template>

<script>
import CoursesZh from '@/components/CoursesZh'
import CoursesEn from '@/components/CoursesEn'

export default {
  components: {
    CoursesZh,
    CoursesEn
  }
}
</script>

<style>
.courses a:not(.btn) {
  color: inherit;
}

.courses a:hover {
  text-decoration: none;
}
</style>
