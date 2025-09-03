<template>
  <span>
    <n-popover trigger="hover">
      <template #trigger>
        <span :class="{ disabled: disabled }" @click="onClick">
          <n-icon style="cursor: pointer" :size="20" color="grey">
            <Add />
          </n-icon>
        </span>
      </template>
      <span>{{ tooltip }}</span>
    </n-popover>
  </span>
</template>

<script>
import { Add } from '@vicons/ionicons5';

export default {
  components: { Add },
  props: {
    tooltip: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  methods: {
    onClick() {
      if (!this.disabled) {
        this.$emit('click');
      }
    },
  },
};
</script>
