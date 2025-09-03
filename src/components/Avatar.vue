<template>
  <n-avatar v-if="avatar" :src="avatar" :size="size" :round="round" />
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    avatar: {
      type: String,
      required: false,
      default: '',
    },
    size: {
      type: Number,
      default: 50,
    },
    round: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
