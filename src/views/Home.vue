<template>
  <div>
    <div class="jumbotron-fluid bg-white mb-0" style="overflow: hidden; position: relative">
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
              <p class="lead">“英语英雄”是一套为中国学习者设计的简明、全面、高质量的网上英语课程。</p>
              <p>“英语英雄”的目的在于解决中国目前英语学习内容混乱、耗时长、低质量、高学费等问题，让所有想提高英语的中国人都可以通过简洁明了的方式按部就班、踏踏实实地提升自己综合的英语能力，并通过丰富的实践和练习让自己的听、说、读、写各方面做到“学以致用”。</p>
            </div>
          </div>
          <div class="col-md-3"></div>
        </div>
      </div>
      <img src="img/ken-standing.png" alt="Ken" class="photo-ken d-none d-lg-block" />
      <img src="img/jon-sitting.png" alt="Jon" class="photo-jon d-none d-lg-block" />
    </div>
    <!-- <Sale /> -->
    <div class="jumbotron-fluid bg-dark pt-5 pl-5 pr-5 pb-4 text-light mb-0 courses" style="position: relative">
      <div class="container text-center foreground">
        <h3 class="mb-4">分级课程</h3>
        <p>
          我们提供所有级别的英语课程，从
          <a
            href="https://zh.wikipedia.org/wiki/%E6%AD%90%E6%B4%B2%E5%85%B1%E5%90%8C%E8%AA%9E%E8%A8%80%E5%8F%83%E8%80%83%E6%A8%99%E6%BA%96"
            style="color: white; font-weight: bold;"
            target="_blank"
          >欧标</a> A1（最初级）到 C2（最高级）。
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
      <img src="/img/ultimate-bundle.jpg" alt class="img-background" style="opacity: 0.2" />
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
            <p>我们经常在哔哩哔哩（B站）上上传最新的关于英语学习的视频。我们也会在B站发布最新的课程和网站功能的说明，促销活动等。您也可以在B站视频下的评论区与我们互动，以及和其他学习者交流。</p>
            <p>我们会在B站公布许多不在我们课程重的内容，所以即使您已经购买了我们的所有课程，我们还是建议您关注我们的B站账号，经常观看最新的视频。</p>
          </div>
          <div class="col-md-3 col-lg-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeVideo from '@/components/YouTubeVideo'
import Sale from '@/components/Sale'

export default {
  components: {
    YouTubeVideo,
    Sale
  },
  mounted() {
    this.redirect()
  },
  watch: {
    $route() {
      if (this.$route.name === 'home') {
        this.redirect()
      }
    }
  },
  methods: {
    redirect() {
      if (
        !(
          this.$lang.options.features &&
          this.$lang.options.features.includes('home')
        )
      ) {
        location.hash = `/${this.$lang.code}/dictionary`
      }
    }
  }
}
</script>

<style>
.photo-jon,
.photo-ken {
  position: absolute;
  bottom: 0;
}
.photo-jon {
  height: 70%;
  right: 0;
}
.photo-ken {
  height: 90%;
  left: 0;
}
</style>
