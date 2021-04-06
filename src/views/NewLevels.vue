<template>
  <div class="container main mt-4 mb-4" v-cloak>
    <div class="row">
      <div class="col-sm-12">
        <div>
          <h4>Words by the new HSK 3.0 (2021-2025?) levels</h4>
          <Loader class="mt-5" />
          <table class="table" v-if="newHSK.length > 0">
            <thead>
              <tr>
                <th>Level</th>
                <th>Number</th>
                <th>Word</th>
                <th>Pinyin</th>
                <th>Definition</th>
                <th>POS</th>
                <th>Example</th>
                <th>Alternative</th>
                <th>Multiple</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="word in newHSK">
                <td>{{ word.level }}</td>
                <td>{{ word.num }}</td>
                <td :data-level="word.hsk">{{ word.simplified }}</td>
                <td>{{ word.pinyin }}</td>
                <td>{{ word.definitions }}</td>
                <td>{{ word.pos }}</td>
                <td>{{ word.example }}</td>
                <td>{{ word.alternative }}</td>
                <td>{{ word.multiple }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      newHSK: [],
    }
  },
  async mounted() {
    let newHSK = await (await this.$dictionary).getNewHSK()
    for (let word of newHSK) {
      let ws = await (await this.$dictionary).lookupSimplified(word.simplified)
      if (ws && ws[0]) {
        let w = ws[0]
        word.hsk = w.hsk
        word.pinyin = w.pinyin
        word.definitions = w.definitions
          .filter((def) => !def.startsWith('CL'))
          .join('; ')
      }
      if (ws.length > 1) {
        ws.shift()
        word.multiple = ws.map(w => `【${w.pinyin}】 ${w.definitions.filter((def) => !def.startsWith('CL')).join('; ')}`).join('. ')
      }
    }
    this.newHSK = newHSK
  },
  methods: {},
}
</script>
<style>
</style>
