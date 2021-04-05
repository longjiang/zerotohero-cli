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
              </tr>
            </thead>
            <tbody>
              <tr v-for="word in newHSK.filter(word => !word.pinyin)">
                <td>{{ word.level }}</td>
                <td>{{ word.num }}</td>
                <td :data-level="word.hsk">{{ word.simplified }}</td>
                <td>{{ word.pinyin }}</td>
                <td>{{ word.definitions }}</td>
                <td>{{ word.pos }}</td>
                <td>{{ word.example }}</td>
                <td>{{ word.alternative }}</td>
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
      let w = await (await this.$dictionary).lookup(word.simplified)
      if (w) {
        word.hsk = w.hsk
        word.pinyin = w.pinyin
        word.definitions = w.definitions
          .filter((def) => !def.startsWith('CL'))
          .join('; ')
      }
    }
    this.newHSK = newHSK
  },
  methods: {},
}
</script>
<style>
</style>
