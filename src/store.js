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
    savedWordCount: state => options => {
      if (state.savedWords[options.l2]) {
        return state.savedWords[options.l2].length
      } else {
        return 0
      }
    }
  }
})
