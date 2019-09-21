<template>
  <div class="container main mt-5 mb-5">
    <div class="row">
      <div class="col-sm-12">
        <h1 class="mb-5 text-center">{{ $t('Contact English Zero to Hero') }}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-lg-6">
        <div class="rounded shadow bg-light p-4 container">
          <div class="row">
            <div class="col-sm-4">
              <img src="img/ken-standing.png" alt="" style="height: 10rem" />
            </div>
            <div class="col-sm-8">
              <h3 class="mb-3">
                {{ $t('Contact Ken with general or business inquiries.') }}
              </h3>
              <p>
                <span
                  ><strong>{{ $t('Ken’s Email:') }} </strong
                  ><a href="mailto:ken@chinesezerotohero.com"
                    >ken@chinesezerotohero.com</a
                  ></span
                >
              </p>
              <p><strong>{{ $t('Ken’s WeChat:') }}</strong> kendai9&nbsp;</p>
            </div>
          </div>
        </div>
        <div class="rounded shadow bg-light p-4  mt-4  mb-4 container">
          <div class="row">
            <div class="col-sm-4">
              <img src="img/jon-sitting.png" alt="" style="height: 8rem" />
            </div>
            <div class="col-sm-8">
              <h3 class="mb-3">
                {{ $t('Contact Jon with course-related questions.') }}
              </h3>
              <p>
                {{ $t('If you are taking our courses and have a question regarding any content, leave a comment in the comment area of the lecture.') }}
              </p>
              <p>
                <strong>{{ $t('Jon’s Reddit:') }}</strong>
                <a href="https://www.reddit.com/user/ZeroToHero__/submitted/">
                  u/ZeroToHero__</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-lg-6">
        <div class="rounded shadow bg-light p-4 container">
          <h3>{{ $t('Join our WeChat discussion group') }}</h3>
          <p class="mt-3">
            {{ $t('Download the WeChat app, scan Ken’s QR code below, leave him a message, and he will invite you into the group.') }}
          </p>
          <img src="/img/ken-wechat-qr.jpg" class="img-fluid" style="max-width: 15rem">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
