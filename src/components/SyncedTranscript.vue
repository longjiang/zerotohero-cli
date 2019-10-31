<template>
  <div class="synced-transcript">
    <div
      :class="{
        transcript: true,
        'mb-4': true,
        collapsed: collapse
      }"
      data-collapse-target
    >
      <div
        v-for="(line, lineIndex) in lines"
        :key="lineIndex"
        :class="{
          'transcript-line': true,
          matched: highlight && line & line.line.includes(highlight),
          'transcript-line-current':
            parseFloat(line.starttime) < currentTime &&
            currentTime <
              parseFloat(
                lines[Math.min(lines.length - 1, lineIndex + 1)].starttime
              )
        }"
        v-on:click="sock(line.starttime)"
      >
        <Annotate tag="div" class="transcript-line-chinese"
          ><span
            v-html="
              highlight
                ? Helper.highlight(line.line, highlight, hsk)
                : line.line
            "
        /></Annotate>
        <div class="transcript-line-l1">
          <span
            v-if="parallellines[lineIndex]"
            v-html="parallellines[lineIndex].line"
          />
        </div>
      </div>
    </div>
    <ShowMoreButton v-if="collapse" :data-bg-level="hsk ? hsk : 'outside'"
      >Show More</ShowMoreButton
    >
  </div>
</template>

<script>
import Helper from '@/lib/helper'

export default {
  props: {
    lines: {
      type: Array
    },
    parallellines: {
      default: false
    },
    collapse: {
      default: false
    },
    onSeek: {
      default: false
    },
    highlight: {
      default: false
    },
    hsk: {
      default: 'outside'
    }
  },
  data() {
    return {
      Helper,
      currentTime: 0
    }
  },
  methods: {
    sock(starttime) {
      if (this.onSeek) {
        this.onSeek(starttime)
      }
    }
  }
}
</script>

<style>
.transcript.collapsed .transcript-line:nth-child(n + 6) {
  display: none;
}

.transcript-line {
  cursor: pointer;
  position: relative;
  color: #666;
  font-size: 1.2rem;
  padding: 0.5rem;
}

.transcript-line-current,
.transcript-line:hover {
  box-shadow: 0 0 10px rgba(255, 95, 32, 0.301);
  border-radius: 0.25rem;
}

.transcript-line.matched {
  color: #616161;
  font-weight: bold;
}

.transcript-title {
  font-weight: bold;
  font-size: 1.5rem;
}

.transcript-line:hover::before {
  content: '▶︎';
  font-size: 1.5rem;
  width: 4rem;
  line-height: 0.8rem;
  display: block;
  color: #f7613540;
  position: absolute;
  right: -2rem;
  bottom: 1rem;
  font-weight: bold;
}

.transcript-line-l1 {
  color: #aaa;
  font-style: italic;
  font-size: 0.8em;
}
</style>
