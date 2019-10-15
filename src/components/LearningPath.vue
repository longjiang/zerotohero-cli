<template>
  <div class="learning-path">
    <div class="level">
      <h4 class="level-title">Introduction to {{ l2.name }}</h4>
      <div v-if="l2.omniglot" class="level-activity">
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
    <div v-for="level in levels" class="level" :data-learning-path-level="level.cefr">
      <h4 class="level-title" :data-level="level.cefr">
        {{ level.category }} ({{ level.cefr }}) Phase
      </h4>
      <p v-if="level.number > 1">
        The goal of this phase is to reach the {{ level.cefr }} level according to the <a href="https://en.wikipedia.org/wiki/Common_European_Framework_of_Reference_for_Languages" target="_blank">Common European Framework of Reference for Languages (CEFR)</a>.
      </p>
      <template v-if="coursesLoaded">
        <div v-for="course in courses[level.cefr]" class="level-activity">
          <p><b :data-level="level.cefr">Activity:</b> Take (or continue to take) the online course:</p>
          <Resource
            :resource="{
              title: course.title,
              url: course.url,
              thumbnail: course.thumbnail.data.full_url
            }"
          />
        </div>
      </template>
      <div class="level-activity" v-if="level.number < 7">
        <p><b :data-level="level.cefr">Activity:</b> Take online tutoring lessons with the help of our Tutoring Kit</p>
        <Resource
          :resource="{
            title: `Online tutoring lesson plans (${level.cefr} level)`,
            url: `/#/${$l1.code}/${l2.code}/tutoring/${level.number}`,
            thumbnail: '/img/online-tutoring.jpg'
          }"
            :internal="true"
        />
      </div>
      <template v-if="resourcesLoaded && resources[level.cefr] && resources[level.cefr].length > 0">
        <div class="level-activity">
          <p><b :data-level="level.cefr">Resources:</b> At the {{ level.cefr }} level, we recommend using the following resources, products, or services:</p>
          <div v-for="resource in resources[level.cefr]">
            <Resource
              :resource="{
                title: resource.title,
                url: resource.url,
                thumbnail: resource.thumbnail.data.full_url
              }"
                :internal="true"
            />
          </div>
        </div>
      </template>
      <template v-if="examsLoaded && level.number > 1">
        <div v-for="exam in exams[level.cefr]" class="level-milestone">
          <div class="level-milestone-dot" :data-bg-level="level.cefr"></div>
          <b :data-level="level.cefr">Milestone:</b> Pass the exam:
          <a :href="exam.url" target="_blank">
            {{ exam.title }}
            <span v-if="exam.level === 'all'">({{level.cefr}})</span>
          </a>
        </div>
      </template>
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
          number: '1',
          cefr: 'PreA1',
          category: 'Beginner'
        },
        {
          number: '2',
          cefr: 'A1',
          category: 'Beginner'
        },
        {
          number: '3',
          cefr: 'A2',
          category: 'Beginner'
        },
        {
          number: '4',
          cefr: 'B1',
          category: 'Intermediate'
        },
        {
          number: '5',
          cefr: 'B2',
          category: 'Intermediate'
        },
        {
          number: '6',
          cefr: 'C1',
          category: 'Advanced'
        },
        {
          number: '7',
          cefr: 'C2',
          category: 'Advanced'
        }
      ],
      exams: {},
      courses: {},
      resources: {},
      examsLoaded: false,
      coursesLoaded: false,
      resourcesLoaded: false,
    }
  },
  methods: {
    async loadExams() {
      let response = await $.getJSON(
        `${Config.wiki}items/exams?filter[l2][eq]=${this.$l2.id}`
      )
      let exams = response.data || []
      for (let exam of exams) {
        for (let level of this.levels) {
          if (exam.level && ['all', level.number].includes(exam.level)) {
            this.exams[level.cefr] = this.exams[level.cefr] || []
            this.exams[level.cefr].push(exam)
          }
        }
      }
      this.examsLoaded = true
    },
    async loadCourses() {
      let response = await $.getJSON(
        `${Config.wiki}items/resources?filter[l2][eq]=${this.$l2.id}&filter[type][eq]=courses&filter[featured][eq]=1&fields=*,thumbnail.*`
      )
      let courses = response.data || []
      for (let course of courses) {
        for (let level of this.levels) {
          if (course.level && course.level.includes(level.number)) {
            this.courses[level.cefr] = this.courses[level.cefr] || []
            this.courses[level.cefr].push(course)
          }
        }
      }
      this.coursesLoaded = true
    },
    async loadResources() {
      let response = await $.getJSON(
        `${Config.wiki}items/resources?filter[l2][eq]=${this.$l2.id}&filter[type][neq]=courses&filter[featured][eq]=1&fields=*,thumbnail.*`
      )
      let resources = response.data || []
      for (let resource of resources) {
        for (let level of this.levels) {
          if (resource.level && resource.level.includes(level.number)) {
            this.resources[level.cefr] = this.resources[level.cefr] || []
            this.resources[level.cefr].push(resource)
          }
        }
      }
      console.log(this.resources)
      this.resourcesLoaded = true
    }
  },
  mounted() {
    this.loadExams()
    this.loadCourses()
    this.loadResources()
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
      content: '';
      background: white;
      display: block;
      position: absolute;
      left: -1.25rem;
      top: 0;
      border-radius: 100%;
      height: 2rem;
      width: 2rem;
      border: 0.5rem solid #ccc;
    }

    &[data-learning-path-level='PreA1'] {
      border-left-color: #b51700;
      &::before {
        border-color: #b51700;
      }
    }

    &[data-learning-path-level='A1'] {
      border-left-color: #0076ba;
      &::before {
        border-color: #0076ba;
      }
    }

    &[data-learning-path-level='A2'] {
      border-left-color: #00882b;
      &::before {
        border-color: #00882b;
      }
    }

    &[data-learning-path-level='B1'] {
      border-left-color: #6a348a;
      &::before {
        border-color: #6a348a;
      }
    }

    &[data-learning-path-level='B2'] {
      border-left-color: #5b0516;
      &::before {
        border-color: #5b0516;
      }
    }

    &[data-learning-path-level='C1'] {
      border-left-color: #011b3c;
      &::before {
        border-color: #011b3c;
      }
    }

    &[data-learning-path-level='C2'] {
      border-left-color: #0f575c;
      &::before {
        border-color: #0f575c;
      }
      &::after {
        content: '';
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

    .level-activity {
      margin-top: 3rem;
      margin-bottom: 3rem;
    }

    .level-milestone {
      position: relative;
      .level-milestone-dot {
        display: block;
        position: absolute;
        left: -2.35rem;
        top: 0;
        border-radius: 100%;
        height: 1.25rem;
        width: 1.25rem;
      }
    }
  }
}
</style>