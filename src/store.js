import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    savedWords: JSON.parse(localStorage.getItem('ezhSavedWords')) || {}
  },
  mutations: {
    ADD_SAVED_WORD(state, options) {
      if (!state.savedWords[options.lang]) {
        state.savedWords[options.lang] = []
      }
      if (
        !state.savedWords[options.lang].find(item => {
          if (item && Array.isArray(item)) {
            return item.join(',') === options.wordForms.join(',')
          }
        })
      ) {
        state.savedWords[options.lang].push(options.wordForms)
        localStorage.setItem('ezhSavedWords', JSON.stringify(state.savedWords))
      }
    },
    REMOVE_SAVED_WORD(state, options) {
      if (state.savedWords[options.lang]) {
        const keepers = state.savedWords[options.lang].filter(
          item => !item.includes(options.wordForm)
        )
        state.savedWords[options.lang] = keepers
        localStorage.setItem('ezhSavedWords', JSON.stringify(state.savedWords))
      }
    },
    REMOVE_ALL_SAVED_WORDS(state, options) {
      if (state.savedWords[options.lang]) {
        state.savedWords[options.lang] = []
        localStorage.setItem('ezhSavedWords', JSON.stringify(state.savedWords))
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
      if (state.savedWords[options.lang]) {
        let yes = state.savedWords[options.lang].find(
          item => Array.isArray(item) && item.includes(options.text)
        )
        return yes
      }
    },
    savedWordCount: state => options => {
      if (state.savedWords[options.lang]) {
        return state.savedWords[options.lang].length
      } else {
        return 0
      }
    }
  }
})
