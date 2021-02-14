<template>
  <div class="main mt-4 mb-4">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div>
            <h2 class="text-center mb-4">Chinese Characters by HSK Level</h2>
            <p class="text-center mb-4">This will take a minute to load...</p>
            <Loader class="mt-5" />
            <table class="table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Character</th>
                  <th>Components</th>
                  <th>Words</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="character in characters">
                  <td>{{ character.hsk }}</td>
                  <td>{{ character.character }}</td>
                  <td>{{ character.decomposition ? character.decomposition.replace(/[⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻？]/g, '') : '' }}</td>
                  <td>{{ character.examples.join(', ') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Helper from '@/lib/helper'

export default {
  async mounted() {
    let characters = await (await this.$dictionary).listCharacters()
    for (let character of characters) {
      let h = await (await this.$hanzi).lookupShallow(character.word)
      character = Object.assign(character, h)
      let examples = (await (await this.$dictionary).lookupByCharacter(
        character.character
      )).filter(example => example.hsk !== 'outside').sort((a, b) => a.hsk - b.hsk)
      character.examples = [...new Set(examples.map(item => item.simplified))]
    }
    this.characters = characters
  },
  data() {
    return {
      characters: []
    }
  }
}
</script>

<style lang="scss">
</style>