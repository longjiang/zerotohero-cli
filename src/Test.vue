<template>
  <div>
    <div class="container mt-4 mb-4">
      <div class="row">
        <div class="col-sm-12">
          Test
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YouTube from '@/lib/youtube'
import Annotate from '@/components/Annotate'
import SimplifyECDICT from '@/lib/simplify-ecdict'
import SketchEngine from '@/lib/sketch-engine'

export default {
  components: {
    Annotate
  },
  methods: {
    simplifyECDICT() {
      SimplifyECDICT.simplify()
    },
    async testCorpInfo() {
      let gramrels = await SketchEngine.gramrels({l1: {code: 'en'}})
      console.log(gramrels)
      let descriptions = {}
      for (let gramrel of gramrels) {
        descriptions[gramrel] = gramrel.replace('%w', '{word}')
      }
      console.log(descriptions)
    }
  },
  mounted() {
    // this.simplifyECDICT()
    this.testCorpInfo()
  }
}
</script>
