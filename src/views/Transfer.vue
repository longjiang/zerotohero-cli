<template>
  <div class="container main pt-5 pb-5">
    <h2 class="text-center mb-5">Teachable 转 “短书” 兑换码查询</h2>
    <p class="lead text-center mb-5">如果您已经在英语英雄 Teachable 平台购买过课程，您可以免费在“短书”平台上访问您购买的课程。</p>

    <div class="input-group" v-cloak style="max-width: 20rem; margin: 0 auto;">
      <input
        type="text"
        class="form-control"
        placeholder="您的邮箱"
        v-model="email"
        @keyup:enter="search"
      />
      <div class="input-group-append">
        <button class="btn btn-warning" @click="search">查询</button>
      </div>
    </div>

    <div v-if="results" class="mt-5">
      <table class="table table-bordered">
        <thead>
          <tr class="bg-light">
            <th>课程</th>
            <th>“短书”赠送码</th>
            <th>“短书”赠送链接</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in results">
            <td>{{ courses[row.course] }}</td>
            <td>
              <code>{{ row.coupon }}</code>
            </td>
            <td>
              <a :href="row.couponURL">点击领取</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Config from '@/lib/config'
export default {
  data() {
    return {
      email: undefined,
      results: undefined,
      courses: {
        pronunciation: '美式英语发音课程',
        '3-a2': '英语英雄 3 级（欧标 A2）',
        '5-b2': '英语英雄 5 级（欧标 B2）',
        '6-c1': '英语英雄 6 级（欧标 C1）',
        'c2-words': 'C2 词汇'
      }
    }
  },
  methods: {
    async search() {
      this.results = await $.getJSON(
        `${Config.server}teachable-duanshu.php?email=${this.email}`
      )
    }
  }
}
</script>

<style>
</style>