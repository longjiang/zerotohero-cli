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
      if (
        !state.savedHits[options.l2].find(hit => deepEqual(hit, hitToSave))
      ) {
        let savedHits = Object.assign({}, state.savedHits)
        savedHits[options.l2].push(hitToSave)
        localStorage.setItem('zthSavedHits', JSON.stringify(savedHits))
        Vue.set(state, 'savedHits', savedHits)
      }
    },
    REMOVE_SAVED_HIT(state, options) {
      let hitToRemove = {
        terms: options.terms,
        videoId: options.hit.video.id,
        lineIndex: options.hit.lineIndex
      }
      if (state.savedHits[options.l2]) {
        const keepers = state.savedHits[options.l2].filter(
          hit => !deepEqual(hit, hitToRemove)
        )
        let savedHits = Object.assign({}, state.savedHits)
        savedHits[options.l2] = keepers
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

export default new Vuex.Store({
  modules: {
    savedWords,
    savedHits
  }
})
