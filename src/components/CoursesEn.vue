<template>
  <div>
    <div
      class="jumbotron-fluid bg-white mb-0"
      style="overflow: hidden; position: relative"
    >
      <div class="container">
        <div class="row">
          <div class="col-md-3"></div>
          <div class="col-sm-12 col-md-12 col-lg-6 text-center">
            <!--<YouTubeVideo
              youtube="5tCCX95G2vg"
              class="shadow"
              style="z-index: 2"
              />-->
            <div class="bg-white p-4 mt-4 mb-5" style="z-index: 100">
              <h1 class="mb-5">学英语，本不该痛苦。</h1>
              <p class="lead">
                “英语英雄”是一套为中国学习者设计的简明、全面、高质量的网上英语课程。
              </p>
              <p>
                “英语英雄”的目的在于解决中国目前英语学习内容混乱、耗时长、低质量、高学费等问题，让所有想提高英语的中国人都可以通过简洁明了的方式按部就班、踏踏实实地提升自己综合的英语能力，并通过丰富的实践和练习让自己的听、说、读、写各方面做到“学以致用”。
              </p>
            </div>
          </div>
          <div class="col-md-3"></div>
        </div>
      </div>
      <img
        src="/img/ken-standing.png"
        alt="Ken"
        class="photo-ken d-none d-lg-block"
      />
      <img
        src="/img/jon-sitting.png"
        alt="Jon"
        class="photo-jon d-none d-lg-block"
      />
    </div>
    <!-- <Sale /> -->
    <div
      class="jumbotron-fluid bg-dark pt-5 pl-5 pr-5 pb-4 text-light mb-0 courses"
      style="position: relative"
    >
      <div class="container text-center foreground">
        <h3 class="mb-4">分级课程</h3>
        <p>
          我们提供所有级别的英语课程，从
          <a
            href="https://zh.wikipedia.org/wiki/%E6%AD%90%E6%B4%B2%E5%85%B1%E5%90%8C%E8%AA%9E%E8%A8%80%E5%8F%83%E8%80%83%E6%A8%99%E6%BA%96"
            style="color: white; font-weight: bold;"
            target="_blank"
            >欧标</a
          >
          A1（最初级）到 C2（最高级）。
        </p>
        <a
          href="https://wazuc.duanshu.com/#/"
          class="btn btn-success view-courses pt-3 pb-2 pl-5 pr-5 mt-3 mb-0"
          style="font-size: 1.5em;"
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
      </div>
    </div>
    <div class="jumbotron-fluid mb-0 pb-0 pt-0">
      <div class="container">
        <h3 class="pb-5 pt-5 text-center">获取“英语英雄”的最新动态</h3>
        <div class="row">
          <div class="col-md-3 col-lg-4"></div>
          <div class="col-md-6 col-lg-4 mb-5">
            <h5 class="mb-4 text-center">哔哩哔哩</h5>
            <a href="https://space.bilibili.com/253569339" class="text-center">
              <span class="media">
                <img src="img/logo-en-zth-circle.png" style="width: 4rem" />
                <div class="media-body">
                  space.bilibili.com/
                  <b>253569339</b>
                </div>
              </span>
            </a>
            <p>
              我们经常在哔哩哔哩（B站）上上传最新的关于英语学习的视频。我们也会在B站发布最新的课程和网站功能的说明，促销活动等。您也可以在B站视频下的评论区与我们互动，以及和其他学习者交流。
            </p>
            <p>
              我们会在B站公布许多不在我们课程重的内容，所以即使您已经购买了我们的所有课程，我们还是建议您关注我们的B站账号，经常观看最新的视频。
            </p>
          </div>
          <div class="col-md-3 col-lg-4"></div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <h1 class="mb-5 text-center">
            {{
              $t('Courses that take your {l2} to the next level.', {
                l2: $l2.name
              })
            }}
          </h1>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <div class="jumbotron text-center pt-5 pb-4 bg-white shadow">
            <a
              href="https://wazuc.duanshu.com/#/"
              class="btn btn-success view-courses pt-3 pb-2 pl-5 pr-5"
              style="font-size: 1.5em;"
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
                  “
                  <a href="https://www.duanshu.com/">短书</a>” </b
                >是个线上课程（所谓“知识付费”）平台。 原先我们使用美国的
                <a href="https://teachable.com/">Teachable</a>。由于国内访问
                Teachable 速度过慢，我们于2019年9月将课程从 Teachable
                迁至“短书”。
              </p>
            </div>
          </div>
          <h2 class="mb-5 text-center" style="margin-top: 5rem">
            什么课程适合我？
          </h2>
          <p class="lead text-center mb-5">请参考以下的教学目标一览表。</p>
          <div class="text-center">
            <img
              src="/img/ezh-curriculum.jpg"
              alt="英语英雄课程等级表"
              class="img-fluid"
            />
          </div>
          <p class="mt-5">参考以下的例子：</p>
          <ul>
            <li>
              比如，您的英语程度已经超越了雅思8，达到了C2的水平，可以学习“C2级词汇”课程。
            </li>
            <li>
              再比如，您是高中生，那么“英语英雄5级”适合您，可以帮助您提高水平直到考过大学六级。
            </li>
            <li>
              再比如，您已经考过中国“英语六级“，那么“英语英雄6级”适合您，可以提高您的英语水平，考过专业八级，达到雅思8分的水平。
            </li>
            <li>
              再比如，您从小学一年级就开始学习英语，现在上小学五年级，那么“英语英雄3级”适合您。
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
</style>