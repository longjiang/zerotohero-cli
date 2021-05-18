import Vue from 'vue'
import Vuex from 'vuex'
import deepEqual from 'deep-equal'

Vue.use(Vuex)

const savedWords = {
  namespaced: true,
  state: {
    savedWords: JSON.parse(localStorage.getItem('zthSavedWords')) || {}
  },
  mutations: {
    ADD_SAVED_WORD(state, options) {
      if (!state.savedWords[options.l2]) {
        state.savedWords[options.l2] = []
      }
      if (
        !state.savedWords[options.l2].find(item => item.id === options.word.id)
      ) {
        let savedWords = Object.assign({}, state.savedWords)
        savedWords[options.l2].push({
          id: options.word.id,
          forms: options.wordForms
        })
        localStorage.setItem('zthSavedWords', JSON.stringify(savedWords))
        Vue.set(state, 'savedWords', savedWords)
      }
    },
    REMOVE_SAVED_WORD(state, options) {
      if (state.savedWords[options.l2]) {
        const keepers = state.savedWords[options.l2].filter(
          item => item.id !== options.word.id
        )
        let savedWords = Object.assign({}, state.savedWords)
        savedWords[options.l2] = keepers
        localStorage.setItem('zthSavedWords', JSON.stringify(savedWords))
        Vue.set(state, 'savedWords', savedWords)
      }
    },
    REMOVE_ALL_SAVED_WORDS(state, options) {
      if (state.savedWords[options.l2]) {
        let savedWords = Object.assign({}, state.savedWords)
        savedWords[options.l2] = []
        localStorage.setItem('zthSavedWords', JSON.stringify(savedWords))
        Vue.set(state, 'savedWords', savedWords)
      }
    }
  },
  actions: {
    add({ commit, dispatch }, options) {
      commit('ADD_SAVED_WORD', options)
    },
    remove({ commit, dispatch }, options) {
      commit('REMOVE_SAVED_WORD', options)
    },
    removeAll({ commit, dispatch }, options) {
      commit('REMOVE_ALL_SAVED_WORDS', options)
    }
  },
  getters: {
    has: state => options => {
      if (state.savedWords[options.l2]) {
        let savedWord = false
        if(options.id) {
          savedWord = state.savedWords[options.l2].find(
            item => item.id && item.id === options.id
          )
        } else {
          savedWord = state.savedWords[options.l2].find(
            item => item.forms.map(form => form ? form.toLowerCase() : '').includes(options.text.toLowerCase())
          ) 
        }
        return savedWord
      }
    },
    count: state => options => {
      if (state.savedWords[options.l2]) {
        return state.savedWords[options.l2].length
      } else {
        return 0
      }
    }
  }
}

const savedHits = {
  namespaced: true,
  state: {
    savedHits: JSON.parse(localStorage.getItem('zthSavedHits')) || {}
  },
  mutations: {
    ADD_SAVED_HIT(state, options) {
      let hitToSave = {
        terms: options.terms,
        videoId: options.hit.video.id,
        lineIndex: options.hit.lineIndex
      }
      if (!state.savedHits[options.l2]) {
        state.savedHits[options.l2] = []
      }
      let savedHits = Object.assign({}, state.savedHits)
      savedHits[options.l2].push(hitToSave)
      localStorage.setItem('zthSavedHits', JSON.stringify(savedHits))
      Vue.set(state, 'savedHits', savedHits)
    },
    REMOVE_SAVED_HIT(state, options) {
      let hitToRemove = {
        terms: options.terms,
        videoId: options.hit.video.id,
        lineIndex: options.hit.lineIndex
      }
      if (state.savedHits[options.l2]) {
        let savedHits = Object.assign({}, state.savedHits)
        const index = savedHits[options.l2].findIndex(
          hit => !deepEqual(hit, hitToRemove)
        )
        savedHits[options.l2].splice(index, 1)
        localStorage.setItem('zthSavedHits', JSON.stringify(savedHits))
        Vue.set(state, 'savedHits', savedHits)
      }
    },
    REMOVE_ALL_SAVED_HITS(state, options) {
      if (state.savedHits[options.l2]) {
        let savedHits = Object.assign({}, state.savedHits)
        savedHits[options.l2] = []
        localStorage.setItem('zthSavedHits', JSON.stringify(savedHits))
        Vue.set(state, 'savedHits', savedHits)
      }
    }
  },
  actions: {
    add({ commit, dispatch }, options) {
      commit('ADD_SAVED_HIT', options)
    },
    remove({ commit, dispatch }, options) {
      commit('REMOVE_SAVED_HIT', options)
    },
    removeAll({ commit, dispatch }, options) {
      commit('REMOVE_ALL_SAVED_HITS', options)
    }
  },
  getters: {
    has: state => options => {
      let hitToTest = {
        terms: options.terms,
        videoId: options.hit.video.id,
        lineIndex: options.hit.lineIndex
      }
      if (state.savedHits[options.l2]) {
        let savedHit = false
        savedHit = state.savedHits[options.l2].find(
          hit => deepEqual(hit, hitToTest)
        )
        return savedHit
      }
    }
  }
}

const savedCollocations = {
  namespaced: true,
  state: {
    savedCollocations: JSON.parse(localStorage.getItem('zthSavedCollocations')) || {}
  },
  mutations: {
    ADD_SAVED_COLLOCATION(state, options) {
      let CollocationToSave = {
        term: options.term,
        line: options.line
      }
      if (!state.savedCollocations[options.l2]) {
        state.savedCollocations[options.l2] = []
      }
      if (
        !state.savedCollocations[options.l2].find(Collocation => deepEqual(Collocation, CollocationToSave))
      ) {
        let savedCollocations = Object.assign({}, state.savedCollocations)
        savedCollocations[options.l2].push(CollocationToSave)
        localStorage.setItem('zthSavedCollocations', JSON.stringify(savedCollocations))
        Vue.set(state, 'savedCollocations', savedCollocations)
      }
    },
    REMOVE_SAVED_COLLOCATION(state, options) {
      console.log(options)
      let CollocationToRemove = {
        term: options.term,
        line: options.line
      }
      let cols = state.savedCollocations[options.l2]
      if (cols) {
        const index = cols.findIndex(
          Collocation => Collocation.term === CollocationToRemove.term && Collocation.line === CollocationToRemove.line
        )
        cols.splice(index, 1)
        let savedCollocations = Object.assign({}, state.savedCollocations)
        savedCollocations[options.l2] = cols
        localStorage.setItem('zthSavedCollocations', JSON.stringify(savedCollocations))
        Vue.set(state, 'savedCollocations', savedCollocations)
      }
    },
    REMOVE_ALL_SAVED_COLLOCATIONS(state, options) {
      if (state.savedCollocations[options.l2]) {
        let savedCollocations = Object.assign({}, state.savedCollocations)
        savedCollocations[options.l2] = []
        localStorage.setItem('zthSavedCollocations', JSON.stringify(savedCollocations))
        Vue.set(state, 'savedCollocations', savedCollocations)
      }
    }
  },
  actions: {
    add({ commit, dispatch }, options) {
      commit('ADD_SAVED_COLLOCATION', options)
    },
    remove({ commit, dispatch }, options) {
      commit('REMOVE_SAVED_COLLOCATION', options)
    },
    removeAll({ commit, dispatch }, options) {
      commit('REMOVE_ALL_SAVED_COLLOCATIONS', options)
    }
  },
  getters: {
    has: state => options => {
      let collocationToTest = {
        term: options.term,
        line: options.line
      }
      if (state.savedCollocations[options.l2]) {
        let savedCollocation = false
        savedCollocation = state.savedCollocations[options.l2].find(
          collocation => deepEqual(collocation, collocationToTest)
        )
        return savedCollocation
      }
    }
  }
}

export default new Vuex.Store({
  modules: {
    savedWords,
    savedHits,
    savedCollocations
  }
})
