<template>
  <div>
    <div class="mt-3">
      <template v-if="$hasFeature('transliteration')">
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="show-pinyin" v-model="showPinyin" />
          <label for="show-pinyin">
            Show
            <span v-if="$l2.code === 'zh'">pinyin</span>
            <span v-else-if="$l2.code === 'ja'">furigana</span>
            <span v-else>romanization</span>
            above words
          </label>
        </div>
        <div class="form-check" v-if="$hasFeature('dictionary') && ['zh', 'yue', 'nan', 'hak', 'th', 'lo', 'ja', 'km', 'ryu', 'bo', 'my'].includes(this.$l2.code) ">
          <input
            type="checkbox"
            class="form-check-input"
            id="show-definition"
            v-model="showDefinition"
          />
          <label for="show-definition">Show definition above words</label>
        </div>
      </template>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="show-translation"
          v-model="showTranslation"
        />
        <label for="show-translation">Show translation</label>
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="show-quiz"
          v-model="showQuiz"
        />
        <label for="show-quiz">Show pop quiz</label>
      </div>
      <div class="form-check" v-if="['zh', 'yue'].includes($l2.code)">
        <input
          type="radio"
          id="use-traditional"
          class="form-check-input"
          v-model="useTraditional"
          value="true"
        />
        <label for="use-traditional">Use Traditional (正體字/繁體字)</label>
      </div>
      <div class="form-check" v-if="['zh', 'yue'].includes($l2.code)">
        <input
          type="radio"
          id="use-simplified"
          class="form-check-input"
          v-model="useTraditional"
          value="false"
        />
        <label for="use-simplified">Use Simplified (简体字)</label>
      </div>
    </div>
    <div class="jumbotron text-center mt-4 p-4">
      <Annotate tag="div" class="mt-4 mb-4 text-left" :showTranslate="true">
        <div v-if="$l2.code === 'zh'">
          <h4>神奇的丝瓜</h4>
          <p>《标准教程 HSK 6》第18课课文</p>
          <p>春天，孩子们在楼旁空地上开出一个小小的花园，随即种上了一棵树、几株花和几粒丝瓜种子。土壤不是很肥沃，但有水的滋润，阳光的照耀，没几天，丝瓜就从土里冒了出来，接着我惊讶地发现，它好像每时每刻都在长大。看着丝瓜，我心中难免不解:古人是怎么想的，愣是编出个拔苗助长的故事来？要是我，宁愿用别的比喻。</p>
        </div>
        <div v-else-if="$l2.code === 'yue'">
          <h4>隨想</h4>
          <p>大家有玩開social media、例如FB同Telegram之類嗰啲，最近有冇發現，多咗好多新朋友？</p>
          <p>某個早上，我起身後，繼續做碌FB之類嘅老人家morning ritual，然後我見到篇呢期好常見嘅陰毛論post，詳細講乜我都唔記得（應該同彥霖老母有關），但當我望一望究竟係邊個些牙嗰陣，咦？條茂利我都唔撚識佢嘅！？名又唔識樣又冇得睇，你點樣鼠入我個newsfeed度㗎？！</p>
          <p>再click入去個profile度睇真啲，好熟口面喎啲嘢，於是再click多兩click，屌！原來係呢條仆街！做乜撚嘢無啦啦走去改名唧？爭人好多錢咩？定係食咗條女𡁻完唱而家俾人尋仇？</p>
        </div>
        <div v-else-if="$l2.code === 'ja'">
          <h4>下がる気温「うちで寝たい」「トイレが」 避難所ルポ</h4>
          <p>各地に大雨被害をもたらした台風１９号で、１６日朝までの朝日新聞の集計によると１２都県で計７５人が死亡し、１３人が行方不明になっている。東日本の広い範囲で河川が氾濫（はんらん）し、福島や長野、宮城など１３都県で計約４５００人が避難生活を余儀なくされた。この日の朝は被災地の多くで気温が１０度を下回り、各地で今季最低を記録。先行きの見えない暮らしが続くなか、避難するお年寄りらは疲れをにじませている。</p>
        </div>
        <div v-else>
          <div
            v-if="$l2.scripts && $l2.scripts[0].direction === 'rtl'"
          >أم تلك غرّة، ارتكبها, و ليرتفع بمعارضة انه. ان خطّة اتفاق سنغافورة الا, بين مايو وقرى في. لان قد قبضتهم ايطاليا،. وسفن إحكام الجديدة، ثم حين, لكون الواقعة الإيطالية فعل أن. به، اعلان أسابيع الوراء ٣٠, أم حدى يذكر أحدث. هو رئيس الأخذ بالرغم حدى, به، أن عرفها أجزاء. بل وفرنسا بلديهما التقليدي مدن, الخطّة العالم، يبق أن, من وزارة استراليا، بحث.</div>
          <div
            v-else
          >Лорем ипсум долор сит амет, вим еи цаусае импетус, не стет тамяуам про, пер цу ерант тхеопхрастус. Ех вих аутем албуциус ментитум, ад дицит елигенди оффициис иус. Еним лабитур оффендит сед цу, апериам цонсулату продессет нец еа, нулла зрил виртуте цу пер. Еа посидониум детерруиссет вих, вих не партем деленит импердиет. Меа ат харум чоро, деленит фабеллас сит ет, нонумы алтера иисяуе еам ет. Еам еи нисл виртуте.</div>
        </div>
      </Annotate>
      <div
        class="text-left translated-line"
      >Translation text is shown. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
      showDefinition: this.$settings.showDefinition,
      showTranslation: this.$settings.showTranslation,
      showPinyin: this.$settings.showPinyin,
      useTraditional: this.$settings.useTraditional,
      showQuiz: this.$settings.showQuiz,
    }
  },
  methods: {
    saveSettings() {
      this.$settings = Object.assign(this.$settings, {
        showDefinition: this.showDefinition,
        showPinyin: this.showPinyin,
        useTraditional: this.useTraditional === 'true',
        showTranslation: this.showTranslation,
        showQuiz: this.showQuiz
      }, this.$settings)
      localStorage.setItem('zthSettings', JSON.stringify(this.$settings))
      this.$parent.$parent.updateSettings++
    }
  },
  watch: {
    showDefinition() {
      this.saveSettings()
    },
    showPinyin() {
      this.saveSettings()
    },
    useTraditional() {
      this.saveSettings()
    },
    showTranslation() {
      this.saveSettings()
    },
    showQuiz() {
      this.saveSettings()
    }
  }
}
</script>
<style>
.translated-line {
  color: #aaa;
  font-style: italic;
  font-size: 0.8em;
}
.translated-line {
  display: none;
}
.show-translation .translated-line {
  display: inherit;
}
</style>