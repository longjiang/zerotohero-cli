<template>
  <div class="mistakes">
    <div class="widget-title mistakes-label">Common mistakes containing “{{ text }}”</div>
    <div class="jumbotron-fluid bg-light p-4">
      <div v-if="mistakes && mistakes.length > 0">
        <ul class="collapsed pl-0" data-collapse-target>
          <li class="list-unstyled mistake-item mt-4 mb-4" v-for="mistake in mistakes">
            <span class="mistake-context collapsed" data-collapse-target>
              <Annotate>{{ mistake.leftContext }}</Annotate>
            </span>
            <Annotate class="mistake-sentence">
              {{ mistake.left }}
              <span class="mistake-word">{{ text }}</span>
              {{ mistake.right }}
            </Annotate>
            <span class="mistake-context collapsed" data-collapse-target>
              <Annotate
                :speak="true"
                :copy="true"
                :showDef="true"
                :fullscreen="true"
              >{{ mistake.rightContext }}</Annotate>
            </span>
            <ShowMoreButton class="mb-2 btn-small ml-2">Context</ShowMoreButton>
            <div>
              <div class="mistake-description">
                <span v-if="mistake.country">
                  Student from
                  <b>{{ mistake.country.name }}</b>
                </span>
                <span v-if="mistake.l1">
                  and speaks
                  <Annotate class="mistake-l1">
                    <b>{{ mistake.l1 }}</b>
                  </Annotate>
                </span>
              </div>
              <div class="mistake-description">
                <span v-if="mistake.errorLevel && mistake.errorType">
                  Mistake with
                  <b>
                    {{ mistake.errorLevel }}
                    <span
                      v-if="mistake.errorType !== 'anomaly'"
                    >({{ mistake.errorType }})</span>
                  </b>
                </span>
              </div>
              <div class="mistake-description">
                <span v-if="mistake.proficiency">
                  <b>{{ Helper.ucFirst(mistake.proficiency) }}</b> Chinese
                  proficiency
                </span>
              </div>
            </div>
          </li>
        </ul>
        <ShowMoreButton :length="mistakes.length" min="4" data-bg-hsk="outside"></ShowMoreButton>
      </div>
      <div
        v-if="mistakes && mistakes.length === 0"
      >Sorry, we could not find any mistakes with “{{ text }}”</div>
      <hr />
      <div class="mt-2">
        Mistake corpus provided by
        <div class="mt-3 mb-1">
          <a
            target="_blank"
            :href="
              `https://app.sketchengine.eu/#concordance?corpname=preloaded%2Fguangwai&tab=basic&keyword=${text}&structs=s%2Cg&refs=%3Ddoc.website&showresults=1&operations=%5B%7B%22name%22%3A%22iquery%22%2C%22arg%22%3A%22${text}%22%2C%22active%22%3Atrue%2C%22query%22%3A%7B%22queryselector%22%3A%22iqueryrow%22%2C%22iquery%22%3A%22${text}%22%7D%2C%22id%22%3A3859%7D%5D`
            "
          >
            <img src="img/logo-sketch-engine.png" alt="Sketch Engine" class="ml-2 logo-small" />
          </a>
          <a
            target="_blank"
            href="https://www.sketchengine.eu/guangwai-lancaster-chinese-learner-corpus/"
          >
            <img src="img/logo-guangwai.png" alt="Sketch Engine" class="ml-4 mb-3 logo-small" />
          </a>
        </div>
        <small>
          Corpus name: Guangwai - Lancaster Chinese Learner Corpus
          <br />Corpus code:
          <code>guangwai</code>
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import SketchEngine from '@/lib/sketch-engine'
import Helper from '@/lib/helper'

export default {
  props: ['text'],
  data() {
    return {
      Helper,
      show: false,
      SketchEngine,
      mistakes: undefined
    }
  },
  methods: {
    showClick() {
      this.show = true
    }
  },
  created() {
    SketchEngine.mistakes(this.text, response => {
      this.mistakes = response
    })
  }
}
</script>
<style>
.mistake-word {
  color: red;
  font-weight: bold;
}

.mistake-icon {
  color: red;
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.mistakes-label {
  background: red;
}

.mistake-flag {
  font-size: 1.5rem;
}

.mistake-description {
  color: #dababa;
}

.mistake-item {
  padding-left: 2rem;
  position: relative;
}

.mistake-item:before {
  content: '\e014';
  font-family: 'Glyphicons Halflings';
  position: absolute;
  left: 0;
  top: 0.2rem;
  font-size: 1.3rem;
  color: red;
}

.mistake-context {
  color: #c1c1c1;
}

.mistake-context.collapsed {
  display: none;
}
</style>
