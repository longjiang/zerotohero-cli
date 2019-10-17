<template>
  <div class="main">
    <div class="container pt-5 pb-5">
      <div class="row">
        <div class="col-sm-12">
          <h1 class="mb-2">Master {{ $l2.name }} in about {{ ($l2.hours || 1100) * 4 }} hours</h1>
          <p class="lead" style="margin-bottom: 3rem">A visual overview</p>
          <LearningPath :l2="$l2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LearningPath from '@/components/LearningPath'

export default {
  components: {
    LearningPath
  }
}
</script>

<style>
</style>
