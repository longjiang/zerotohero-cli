import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    savedWords: JSON.parse(localStorage.getItem('zthSavedWords')) || {}
  },
  mutations: {
    ADD_SAVED_WORD(state, options) {
      if (!state.savedWords[options.l2]) {
        state.savedWords[options.l2] = []
      }
      if (
        !state.savedWords[options.l2].find(item => {
          if (item && Array.isArray(item)) {
            return item.join(',') === options.wordForms.join(',')
          }
        })
      ) {
        state.savedWords[options.l2].push(options.wordForms)
        localStorage.setItem('zthSavedWords', JSON.stringify(state.savedWords))
      }
    },
    REMOVE_SAVED_WORD(state, options) {
      if (state.savedWords[options.l2]) {
        const keepers = state.savedWords[options.l2].filter(
          item => !item.includes(options.wordForm)
        )
        state.savedWords[options.l2] = keepers
        localStorage.setItem('zthSavedWords', JSON.stringify(state.savedWords))
      }
    },
    REMOVE_ALL_SAVED_WORDS(state, options) {
      if (state.savedWords[options.l2]) {
        state.savedWords[options.l2] = []
        localStorage.setItem('zthSavedWords', JSON.stringify(state.savedWords))
      }
    }
  },
  actions: {
    addSavedWord({ commit, dispatch }, options) {
      commit('ADD_SAVED_WORD', options)
      dispatch('updateSavedWordsDisplay')
    },
    removeSavedWord({ commit, dispatch }, options) {
      commit('REMOVE_SAVED_WORD', options)
      dispatch('updateSavedWordsDisplay')
    },
    removeAllSavedWords({ commit, dispatch }, options) {
      commit('REMOVE_ALL_SAVED_WORDS', options)
      dispatch('updateSavedWordsDisplay')
    },
    blinkedSavedWordsButton() {
      $('.tab-saved-words').removeClass('blink')
      setTimeout(() => {
        $('.tab-saved-words').addClass('blink')
      }, 500)
    },
    updateSavedWordsDisplay({ dispatch, getters }) {
      dispatch('blinkedSavedWordsButton')
    }
  },
  getters: {
    hasSavedWord: state => options => {
      if (state.savedWords[options.l2]) {
        let yes = state.savedWords[options.l2].find(
          item => Array.isArray(item) && item.includes(options.text)
        )
        return yes
      }
    },
    savedWordCount: state => options => {
      if (state.savedWords[options.l2]) {
        return state.savedWords[options.l2].length
      } else {
        return 0
      }
    }
  }
})
