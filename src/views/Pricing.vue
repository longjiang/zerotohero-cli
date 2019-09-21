<template>
  <div class="container mt-5 mb-5">
    <div class="row">
      <div class="col-sm-12">
        <h1 class="mb-5">{{ $t('Pricing Chart') }}</h1>
        <!-- <Sale class="mb-5 rounded" /> -->
        <div class="bg-success text-light p-3 text-center mb-5 rounded">
          <h4 class="mb-0">购买一次，永远享有! 😊 （没有月费年费）</h4>
        </div>
        <p class="mb-3">
          <b>这里的价格<em>不是</em>月费、年费.</b> 您购买后就可以永远享有，不需要重复支付。
        </p>
        <p>
          选择货币：
          <select v-if="rates" name="" id="" v-model="currency" class="mb-3">
            <option
              v-for="(rate, symbol) in rates"
              :value="symbol"
              :selected="currency === symbol"
              >{{ symbol.replace('CNY', 'RMB') }}</option
            >
          </select>
        </p>

        <table class="table table-bordered pricing-table" :key="key">
          <thead>
            <tr class="table-secondary">
              <th class="text-left">课程</th>
              <th class="text-center">价格</th>
            </tr>
          </thead>
          <tbody class="table-hover">
            <tr>
              <td
                class="text-left text-light"
                data-bg-level="PreA1"
              >
                英语英雄1级（欧标Pre-A1）
              </td>
              <td class="text-center">
                待定
              </td>
            </tr>

            <tr>
              <td
                class="text-left text-light"
                data-bg-level="A1"
              >
                英语英雄2级（欧标A1）
              </td>
              <td class="text-center">
                待定
              </td>
            </tr>

            <tr>
              <td
                class="text-left text-light"
                data-bg-level="A2"
              >
                英语英雄3级（欧标A2）
              </td>
              <td class="text-center">
                待定
              </td>
            </tr>

            <tr>
              <td
                class="text-left text-light"
                data-bg-level="B1"
              >
                英语英雄4级（欧标B1）
              </td>
              <td class="text-center">
                待定
              </td>
            </tr>

            <tr>
              <td
                class="text-left text-light"
                data-bg-level="B2"
              >
                <a href="https://wazuc.duanshu.com/#/course/cb3011a438c14b979eda82c8de1ed6f0">英语英雄5级（欧标B2）</a>
              </td>
              <td class="text-center">
                <span v-html="price(149, {sale: false})"></span>
              </td>
            </tr>
            <tr>
              <td
                class="text-left text-light"
                data-bg-level="C1"
              >
                <a href="https://wazuc.duanshu.com/#/course/af26c83d32c843afa13cb915cbf1ab43">英语英雄6级（欧标C1）</a>
              </td>
              <td class="text-center">
                <span v-html="price(149, {sale: false})"></span>
              </td>
            </tr>
            <tr>
              <td
                class="text-left text-light"
                style="background-color: #004d81"
              >
                <a href="https://wazuc.duanshu.com/#/course/278543abd13b4dbcb5dfa6458803fd1c">流利之路</a>
              </td>
              <td class="text-center">
                <b>免费</b>
              </td>
            </tr>
            <tr>
              <td
                class="text-left text-light"
                style="background-color: #004d81"
              >
                <a href="https://wazuc.duanshu.com/#/course/02eaa75857d749048504c0f9a3d89a87">美式英语发音</a>
              </td>
              <td class="text-center" colspan="3"><span v-html="price(99, {sale: false})"></span></td>
            </tr>
            <tr>
              <td
                class="text-left text-light"
                data-bg-level="C2"
              >
                <a href="https://wazuc.duanshu.com/#/brief/course/82ada0a7cd424e568c14d399207df96d">欧标 C2 词汇</a>
              </td>
              <td class="text-center" colspan="3"><span v-html="price(69, {sale: false})"></span></td>
            </tr>
            <tr>
              <td
                class="text-left text-light"
                data-bg-level="outside"
              >
                英雄学院
              </td>
              <td class="text-center" colspan="3">待定</td>
            </tr>
            <tr>
              <td
                class="text-left text-light"
                data-bg-level="outside"
              >
                <a href="#/dictionary">词典</a>, <a href="#/zh/youtube/browse">视听资源</a>, <a href="#/reader">阅读资源</a>以及这个网站上的其它资源
              </td>
              <td class="text-center align-middle" colspan="3"><b>免费</b></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import fx from 'money'
import accounting from 'accounting'
import Sale from '@/components/Sale'

export default {
  components: {
    Sale
  },
  props: {
    args: {
      default: 'CNY'
    }
  },
  data() {
    return {
      accounting,
      currency: this.args,
      key: 'USD',
      rates: undefined
    }
  },
  methods: {
    money(n) {
      if (this.rates) {
        return accounting
          .formatMoney(
            Math.round(fx.convert(n, { from: 'CNY', to: this.currency })),
            { symbol: this.currency, format: '%v %s', precision: 0 }
          )
          .replace('CNY', 'RMB')
      } else {
        return n + ' RMB'
      }
    },
    price(n, options) {
      if (options.sale === true) {
        return `<strike>${this.money(n)}</strike><br/><span class="sale-price">SALE: <b>${this.money(n * 0.75)}</b></span>`
      } else {
        return `<b>${this.money(n)}</b>`
      }

    }
  },
  watch: {
    args() {
      this.currency = this.args
    },
    currency() {
      location.hash = `#/${this.$lang.code}/pricing/${this.currency}`
    }
  },
  created() {
    // Load exchange rates data via AJAX:
    $.getJSON(
      // NB: using Open Exchange Rates here, but you can use any source!
      'https://api.exchangeratesapi.io/latest',
      data => {
        // Check money.js has finished loading:
        this.rates = data.rates
        this.key = this.currency
        if (typeof fx !== 'undefined' && fx.rates) {
          fx.rates = data.rates
          fx.base = data.base
        }
      }
    )
  }
}
</script>

<style>
.sale-price {
  color: red;
}
.pricing-table td:first-child,
.pricing-table th:first-child {
  font-weight: bold;
  max-width: 10rem;
}

.pricing-table a,
.pricing-table a:hover {
  color: white;
}
</style>
