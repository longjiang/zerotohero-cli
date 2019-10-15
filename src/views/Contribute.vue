<template>
  <div>
    <div class="jumbotron shadow rounded bg-white">
      <h4 class="text-center mb-3">Adopt <em>{{ $l2.name }} Zero to Hero{{ $l2.code === 'en' ? ` (for ${$l1.name} speakers)` : ''  }}</em> today.</h4>
      <p class="lead text-center mb-4">And help the world learn <a :href="`https://en.wikipedia.org/wiki/${$l2.name.replace(/ /g, '_')}`">{{ $l2.name }}</a>{{ $l2.code === 'en' ? ` through ${$l1.name}` : ''  }}.</p>
      <div class="text-center"><a :href="`#/${$l1.code}/${$l2.code}/contact-us`" class="btn btn-success">Contact Us</a></div>
    </div>
    <h6>What can I do once I adopt <em>{{ $l2.name }} Zero to Hero</em>?</h6>
    <ul>
      <li>You can <em>add anything you want</em> on this page that help people learn {{ $l2.name }}.</li>
      <li>You can promote your own free or paid products that help people learn {{ $l2.name }}.</li>
      <li>You can promote other people's {{ $l2.name }}-learning products, free or paid. You can generate revenue with affiliate marketing if you wish.</li>
      <li>If you are a developer, you can contribute code to this project, which is entirely <a href="https://github.com/longjiang/zerotohero-cli">open-source on Github</a>.</li>
    </ul>
    <h6>Is this project open-source?</h6>
    <ul>
      <li>You bet!</li>
      <li>All parts of this website, {{ $l2.name }} Zero to Hero, Chinese Zero to Hero, English Zero to Hero... Whatever-Language-You-Can-Name Zero to Hero, are entirely open-source.</li>
      <li>You can clone the code on <a href="https://github.com/longjiang/zerotohero-cli">Github</a> and help to develop it.</li>
    </ul>
    <h6>How do you make money?</h6>
    <ul>
      <li>We make money by selling online courses at <a href="#/en/zh">Chinese Zero to Hero</a> and <a href="#/zh/en">English Zero to Hero</a>.</li>
      <li>You also have the potential to generate income by developing {{ $l2.name }} Zero to Hero.</li>
    </ul>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>