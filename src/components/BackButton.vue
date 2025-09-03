<template>
  <n-button
    class="btn"
    :style="{ '--n-width': computedWidth, 'margin-left': 'auto' }"
    @click="handleClick"
  >
    {{ $t('back') }}
  </n-button>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: 'auto',
    },
  },
  computed: {
    computedWidth() {
      return this.width;
    },
  },
  methods: {
    handleClick() {
      window.history.back();
    },
  },
};
</script>
