<template>
  <div class="learning-path">
    <div class="level">
      <h4 class="level-title">Introduction to {{ l2.name }}</h4>
      <div>
        <div v-if="l2.omniglot">
          <p>Learn information about {{ l2.name }} and learn some beginner phrases from Omniglot.</p>
          <Resource
            :resource="{
              title: `Getting started with ${l2.name} from Omniglot`,
              url: `/#/${$l1.code}/${l2.code}/book/chapter/https%3A%2F%2Fwww.omniglot.com%2Fwriting%2F${encodeURIComponent(l2.omniglot)}`,
              thumbnail: '/img/omniglot-banner.jpg'
            }"
            :internal="true"
          />
        </div>
      </div>
    </div>
    <div v-for="level in levels" class="level" :data-learning-path-level="level.name">
      <h4 class="level-title">
        {{ level.category }} <span :data-level="level.name">({{ level.name }})</span>
      </h4>
      <div v-for="exam in examsA1">
        Pass the exam:
        <a :href="exam.url">
          {{ exam.title }}
          <span v-if="exam.level === 'all'">({{level.name}})</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeVideo from '@/components/YouTubeVideo'
import ResourceList from '@/components/ResourceList'
import Resource from '@/components/Resource'
import Config from '@/lib/config'

export default {
  components: {
    Resource,
    YouTubeVideo,
    ResourceList
  },
  props: ['l2'],
  data() {
    return {
      levels: [
        {
          name: 'PreA1',
          category: 'Beginner'
        },
        {
          name: 'A1',
          category: 'Beginner'
        },
        {
          name: 'A2',
          category: 'Beginner'
        },
        {
          name: 'B1',
          category: 'Intermediate'
        },
        {
          name: 'B2',
          category: 'Intermediate'
        },
        {
          name: 'C1',
          category: 'Advanced'
        },
        {
          name: 'C2',
          category: 'Advanced'
        }
      ],
      examsA1: [],
      examsA2: [],
      examsB1: [],
      examsB2: [],
      examsC1: [],
      examsC2: []
    }
  },
  async mounted() {
    let response = await $.getJSON(
      `${Config.wiki}items/exams?filter[l2][eq]=${this.$l2.id}`
    )
    let exams = response.data || []
    for (let exam of exams) {
      for (let level of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) {
        if (exam.level && ['all', level].includes(exam.level)) {
          this[`exams${level}`].push(exam)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.learning-path {

  .level {
    padding-bottom: 3rem;
    padding-left: 1.5rem;
    border-left: 0.5rem solid #ccc;
    position: relative;

    &::before {
      content: "";
      background: white;
      display: block;
      position: absolute;
      left: -1rem;
      top: 0;
      border-radius: 100%;
      height: 1.5rem;
      width: 1.5rem;
      border: 0.3rem solid #ccc;
    }

    &[data-learning-path-level="PreA1"] {
      border-left-color: #B51700;
      &::before {
        border-color: #B51700;
      }
    }

    &[data-learning-path-level="A1"] {
      border-left-color: #0076BA;
      &::before {
        border-color: #0076BA;
      }
    }

    &[data-learning-path-level="A2"] {
      border-left-color: #00882B;
      &::before {
        border-color: #00882B;
      }
    }

    &[data-learning-path-level="B1"] {
      border-left-color: #6A348A;
      &::before {
        border-color: #6A348A;
      }
    }

    &[data-learning-path-level="B2"] {
      border-left-color: #5B0516;
      &::before {
        border-color: #5B0516;
      }
    }

    &[data-learning-path-level="C1"] {
      border-left-color: #011B3C;
      &::before {
        border-color: #011B3C;
      }
    }

    &[data-learning-path-level="C2"] {
      border-left-color: #0f575c;
      &::before {
        border-color: #0f575c;
      }
      &::after {
        content: "";
        border-top: 2rem solid #0f575c;
        border-left: 1rem solid transparent;
        border-right: 1rem solid transparent;
        display: block;
        position: absolute;
        left: -1.25rem;
        bottom: -2rem;
        height: 0;
        width: 0;
      }
    }

    .level-title {
      margin-bottom: 1rem;
    }
  }
}
</style>