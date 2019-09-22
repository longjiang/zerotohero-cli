<template>
  <a
    :href="`#/${l1.code}/${l2.code}/`"
    class="mr-4 mb-4 d-inline-block link-unstyled"
  >
    <div class="logo-constructed">
      <div class="logo-circle" :style="`background-image:url(/img/logo-square/${l2.code}.jpg)`">
        <div
          class="logo-speech-bubble"
          :style="`background-image: url(/img/speech-light.png)`"
        >
          <b>{{ l2.code.slice(0,1).toUpperCase()}}{{ l2.code.slice(1,2) }}</b>
        </div>
      </div>
      <div class="logo-text text-white">
        <template v-if="l2['iso639-2t'] === 'eng'">
          <div class="logo-text-language">{{ l1.translations ? l1.translations['english'] : 'English' }}</div>
          <div class="logo-text-zth">{{ l1.translations ? l1.translations['zerotohero'] : 'Zero to Hero' }}</div>
        </template>
        <template v-else>
          <div class="logo-text-language">{{ l2.name.toUpperCase() }}</div>
          <div class="logo-text-zth">ZERO TO HERO</div>
        </template>
      </div>
    </div>
  </a>
</template>

<script>
import Config from '@/lib/config'

export default {
  props: ['l1', 'l2'],
  data() {
    return {
      Config
    }
  }
}
</script>

<style>
.logo-image {
  height: 4rem;
}
.logo-constructed {
  display: flex;
  align-items: flex-end;
  padding-top: 0.8rem;
}
.logo-circle {
  height: 2.75rem;
  width: 2.75rem;
  background: #ccc;
  border-radius: 100%;
  position: relative;
  margin-right: 0.7rem;
  background-size: cover;
}
.logo-text {
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
  text-align: left;
  margin-bottom: -0.4rem;
}
.logo-speech-bubble {
  height: 2rem;
  width: 2rem;
  background-size: cover;
  line-height: 2rem;
  text-align: center;
  font-size: 0.7rem;
  color: #555;
  position: absolute;
  right: -0.4rem;
  top: -0.8rem;
}
.logo-speech-bubble b {
  display: block;
  position: relative;
  bottom: 0.1em;
}
.logo-text-language {
  font-weight: 100;
  margin-bottom: -0.3em;
  text-transform: uppercase;
}
.logo-text-zth {
  font-weight: bold;
  text-transform: uppercase;
}
</style>