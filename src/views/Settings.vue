<template>
  <div class="main mt-4 mb-5" v-cloak>
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <h1 class="page-title mb-4">
            {{ $t('Settings') }}
          </h1>
          <div>
            <h4>{{ $t('Text Corpus Settings') }}</h4>
            <p v-if="$lang.code === 'zh'">
              <a
                href="https://baike.baidu.com/item/%E8%AF%AD%E6%96%99%E5%BA%93"
                target="_blank"
                >语料库</a>是用大量语言文本编写而成的集合，让我们我们可以提取词语搭配和例句。我们的文本语料库由 <a href="https://www.sketchengine.eu/">Sketch Engine</a> 提供，有许多不同的英语语料库可供选择。根据你选择的语料库，你看到的例句和词语搭配会有所不同。
            </p>
            <p v-else>
              A
              <a
                href="https://en.wikipedia.org/wiki/Text_corpus"
                target="_blank"
                >text corpus</a
              >
              is a large collection of text written in a language, where we can
              extract collocations and example sentences.
              <a href="https://www.sketchengine.eu/">Sketch Engine</a>, our text
              corpora provider, has a number of English text corpora to select
              from. Depending on the corpus you choose, the example sentences
              and collocations you see will be different.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <CorpusSelect />
    </div>
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="jumbotron mt-5 p-4 bg-warning text-dark">
            Settings are <b>automatically saved</b> as soon as you make the
            change.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CorpusSelect from '@/components/CorpusSelect'

export default {
  components: {
    CorpusSelect
  },
  data() {
    return {
    }
  }
}
</script>
