<template>
  <div class="corpus-select">
    <table class="table table-bordered table-responsive">
      <thead>
        <tr>
          <th></th>
          <th>{{ $t('Corpus') }}</th>
          <th>{{ $t('Code') }}</th>
          <th>{{ $t('Language') }}</th>
          <th>{{ $t('Words') }}</th>
          <th>{{ $t('Note') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="corpus in SketchEngine.corpora.filter(
            corpus =>
              [$l2.code].concat($l2.locales || []).includes(corpus.language_id) && (!(corpus.tags && corpus.tags.includes('learner')))
          ).sort((a,b) => b.sizes.wordcount - a.sizes.wordcount)"
        >
          <td>
            <input
              type="radio"
              :value="corpus.corpname"
              :checked="corpus.corpname === SketchEngine.corpname($l2)"
              v-model="corpname"
            />
          </td>
          <td>{{ corpus.name }}</td>
          <td>
            <code>{{ corpus.corpname.replace('preloaded/', '') }}</code>
          </td>
          <td>{{ corpus.language_name }}</td>
          <td class="text-right">{{ Intl.NumberFormat('en-US').format(corpus.sizes.wordcount) }}</td>
          <td>
            {{ corpus.info }}
            <ul>
              <li v-if="corpus.is_featured">Featured.</li>
              <li v-if="corpus.aligned">Parallel. That means L1 translation is available.</li>
              <li v-if="corpus.diachronic">Diachronic. That means time information is available.</li>
              <li v-if="corpus.tags && corpus.tags.includes('spoken')">Spoken.</li>
              <li v-if="corpus.tags && corpus.tags.includes('web')">Web.</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import SketchEngine from '@/lib/sketch-engine'
export default {
  data() {
    return {
      SketchEngine,
      corpname: SketchEngine.corpname(this.$l2)
    }
  },
  watch: {
    corpname() {
      let corpnames = JSON.parse(localStorage.getItem('zthCorpnames')) || {}
      corpnames[this.$l2.code] = this.corpname
      localStorage.setItem('zthCorpnames', JSON.stringify(corpnames))
      location.reload() // Otherwise users won't see the new collocations and example sentences, leaving them confused.
    }
  }
}
</script>

<style></style>
