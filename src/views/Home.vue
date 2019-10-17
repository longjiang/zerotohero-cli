<template>
  <div class="main">
    <div class="container pt-5 pb-5">
      <div class="row">
        <div class="col-sm-12">
          <h1 class="mb-2 text-center">How to master {{ $l2.name }}</h1>
          <p class="lead text-center" style="margin-bottom: 3rem">A visual overview</p>
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
