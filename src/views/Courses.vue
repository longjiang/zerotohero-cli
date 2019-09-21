<template>
  <div class="container mt-5 mb-5">
    <div class="row">
      <div class="col-sm-12">
        <h1 class="mb-5 text-center">{{ $t('Courses that take your English to the next level.') }}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="jumbotron text-center pt-5 pb-4 bg-white shadow">
          <a
            href="https://wazuc.duanshu.com/#/"
            class="btn btn-success view-courses pt-3 pb-2 pl-5 pr-5" style="font-size: 1.5em;"
            target="_blank"
          >
            {{ $t('View all of our courses on') }}
            <img
              src="/img/logo-duanshu-light.png"
              alt="短书"
              class="ml-2 mb-2"
              style="height: 2rem; width: auto;"
            />
          </a>
          <div style="max-width: 30rem; margin: 0 auto;">
            <p class="mt-4 text-left text-secondary">
              <b>
                “<a href="https://www.duanshu.com/">短书</a>”
              </b>是个线上课程（所谓“知识付费”）平台。
              原先我们使用美国的
              <a href="https://teachable.com/">Teachable</a>。由于国内访问 Teachable 速度过慢，我们于2019年9月将课程从 Teachable 迁至“短书”。
            </p>
          </div>
        </div>
        <h2 class="mb-5 text-center" style="margin-top: 5rem">什么课程适合我？</h2>
        <p class="lead text-center mb-5">请参考以下的教学目标一览表。</p>
        <div class="text-center">
          <img src="/img/ezh-curriculum.jpg" alt="英语英雄课程等级表" class="img-fluid" />
        </div>
        <p class="mt-5">参考以下的例子：</p>
        <ul>
          <li>比如，您的英语程度已经超越了雅思8，达到了C2的水平，可以学习“C2级词汇”课程。</li>
          <li>再比如，您是高中生，那么“英语英雄5级”适合您，可以帮助您提高水平直到考过大学六级。</li>
          <li>再比如，您已经考过中国“英语六级“，那么“英语英雄6级”适合您，可以提高您的英语水平，考过专业八级，达到雅思8分的水平。</li>
          <li>再比如，您从小学一年级就开始学习英语，现在上小学五年级，那么“英语英雄3级”适合您。</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.courses a:not(.btn) {
  color: inherit;
}

.courses a:hover {
  text-decoration: none;
}
</style>
