<template>
  <n-input
    v-model:value="text"
    class="container"
    type="text"
    :placeholder="placeholder"
    :count="count"
    :size="size"
    :readonly="readonly"
    :minlength="minlength"
    :maxlength="maxlength"
    :clearable="clearable"
  />
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    count: {
      type: Number,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: 'medium',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    maxlength: {
      type: Number,
      default: null,
    },
    minlength: {
      type: Number,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    text: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
};
</script>

<style scoped>
.container {
  min-width: 50px;
  max-width: 250px;
  align-items: center;
}
</style>
