<template>
  <div class="container main mt-5 mb-5">
    <div class="row">
      <div class="col-sm-12">
        <h1 class="text-center">
          Seperable verbs (<Annotate>离合词</Annotate>)
        </h1>
        <p class="text-center mb-5">
          <Annotate>
            A <em>separable</em> verb (for example, 唱歌) consists of a verb
            (唱) and an object (歌). Because of this, they can take the
            following forms. Note that a variety of measure words and
            complements can be used, not just the ones listed in the chart.
          </Annotate>
        </p>
        <table
          class="table table-responsive seperable-table"
          style="color: #666"
        >
          <thead>
            <tr>
              <th>HSK</th>
              <th>VO</th>
              <th>V 不 V O?</th>
              <th>V 了 O</th>
              <th>V 了 一 M O</th>
              <th>V 没 V O?</th>
              <th><a href="#/grammar/view/259">V V O</a></th>
              <th><a href="#/grammar/view/260">V 了 V O</a></th>
              <th>V Complement O</th>
              <th>V 得 Complement O</th>
              <th>V 不 Complement O</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in separables">
              <th>
                {{ s.hsk }}
              </th>
              <th>
                <Annotate>{{ s.v }}{{ s.o }}</Annotate>
              </th>
              <td>
                <Annotate>{{ s.v }}不{{ s.v }}{{ s.o }}？</Annotate>
              </td>
              <td>
                <Annotate>{{ s.v }}了{{ s.o }}</Annotate>
              </td>
              <td>
                <Annotate>{{ s.v }}了一{{ s.measure }}{{ s.o }}</Annotate>
              </td>
              <td>
                <Annotate>{{ s.v }}没{{ s.v }}{{ s.o }}？</Annotate>
              </td>
              <td>
                <Annotate>{{ s.v }}{{ s.v }}{{ s.o }}</Annotate>
              </td>
              <td>
                <Annotate>{{ s.v }}了{{ s.v }}{{ s.o }}</Annotate>
              </td>
              <td>
                <Annotate>{{ s.v }}完{{ s.o }}</Annotate>
              </td>
              <td>
                <Annotate>{{ s.v }}得了{{ s.o }}</Annotate>
              </td>
              <td>
                <Annotate>{{ s.v }}不了{{ s.o }}</Annotate>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    for (let separable of this.separables) {
      separable.v = separable.simplified[0]
      separable.o = separable.simplified[1]
    }
  },
  data() {
    return {
      separables: [
        {
          hsk: 2,
          simplified: '唱歌',
          measure: '首'
        },
        {
          hsk: 2,
          simplified: '跳舞',
          measure: '个'
        },
        {
          hsk: 2,
          simplified: '上班',
          measure: '趟'
        },
        {
          hsk: 2,
          simplified: '考试',
          measure: '次'
        },
        {
          hsk: 2,
          simplified: '游泳',
          measure: '回'
        },
        {
          hsk: 3,
          simplified: '帮忙',
          measure: '个'
        },
        {
          hsk: 3,
          simplified: '见面',
          measure: '回'
        },
        {
          hsk: 3,
          simplified: '洗澡',
          measure: '个'
        },
        {
          hsk: 3,
          simplified: '生气',
          measure: '场'
        },
        {
          hsk: 3,
          simplified: '刷牙',
          measure: '个'
        },
        {
          hsk: 3,
          simplified: '上网',
          measure: '个'
        },
        {
          hsk: 4,
          simplified: '打折',
          measure: '回'
        },
        {
          hsk: 4,
          simplified: '道歉',
          measure: '个'
        },
        {
          hsk: 4,
          simplified: '鼓掌',
          measure: '个'
        },
        {
          hsk: 4,
          simplified: '减肥',
          measure: '次'
        },
        {
          hsk: 4,
          simplified: '理发',
          measure: '个'
        },
        {
          hsk: 4,
          simplified: '请假',
          measure: '个'
        },
        {
          hsk: 4,
          simplified: '请客',
          measure: '次'
        },
        {
          hsk: 4,
          simplified: '散步',
          measure: '会'
        },
        {
          hsk: 4,
          simplified: '握手',
          measure: '个'
        },
        {
          hsk: 5,
          simplified: '吵架',
          measure: '回'
        },
        {
          hsk: 5,
          simplified: '划船',
          measure: '次'
        },
        {
          hsk: 5,
          simplified: '离婚',
          measure: '次'
        },
        {
          hsk: 6,
          simplified: '答辩',
          measure: '个'
        },
        {
          hsk: 6,
          simplified: '打架',
          measure: '回'
        },
        {
          hsk: 6,
          simplified: '打仗',
          measure: '场'
        },
        {
          hsk: 6,
          simplified: '捣乱',
          measure: '场'
        },
        {
          hsk: 6,
          simplified: '发财',
          measure: '笔'
        },
        {
          hsk: 6,
          simplified: '发呆',
          measure: '会'
        },
        {
          hsk: 6,
          simplified: '发火',
          measure: '场'
        },
        {
          hsk: 6,
          simplified: '发誓',
          measure: '个'
        },
        {
          hsk: 6,
          simplified: '分手',
          measure: '次'
        },
        {
          hsk: 6,
          simplified: '化妆',
          measure: '个'
        },
        {
          hsk: 6,
          simplified: '敬礼',
          measure: '个'
        },
        {
          hsk: 6,
          simplified: '投票',
          measure: ''
        },
        {
          hsk: 6,
          simplified: '做东',
          measure: '回'
        },
        {
          hsk: 6,
          simplified: '做主',
          measure: '个'
        }
      ]
    }
  }
}
</script>

<style>
.seperable-table th,
.seperable-table td {
  white-space: nowrap;
  vertical-align: middle;
  text-align: center;
}
</style>
