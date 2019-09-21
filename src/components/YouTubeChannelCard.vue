<template>
  <a :href="`#/${$lang.code}/youtube/channel/${channel.id}`" class="link-unstyled channel">
    <img :src="channel.avatar" class="channel-avatar" alt />
    <div class="channel-body">
      <h6>
        <Annotate><span>{{ channel.title }}</span></Annotate>
      </h6>
      <Annotate><div v-if="channel.description">{{ channel.description }}</div></Annotate>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    channel: {
      type: Object
    }
  }
}
</script>

<style>
.channel {
  display: flex;
  align-items: top;
  overflow: hidden;
}
.channel-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
}
.channel-avatar {
  border-radius: 100%;
  height: 4rem;
  float: left;
  margin-right: 1rem;
}
</style>
