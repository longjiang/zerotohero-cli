<template>
  <router-link :to="`/${$l1.code}/${$l2.code}/youtube/channel/${channel.id}`" class="link-unstyled channel">
    <img v-if="channel.avatar" :src="channel.avatar" class="channel-avatar" alt />
    <div class="channel-body">
      <h6>
        Channel: <Annotate><span>{{ channel.title }}</span></Annotate>
      </h6>
      <Annotate v-if="channel.description"><div>{{ channel.description }}</div></Annotate>
    </div>
  </router-link>
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
