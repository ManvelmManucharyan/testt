<template>
  <div :class="computedClass">
    <n-select
      v-model:value="selectedTypes"
      :options="computedOptions"
      label-field="value"
      value-field="id"
      :placeholder="placeholder"
      clearable
    />
  </div>
</template>

<script>
export default {
  name: 'CompanySelect',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Array, Number],
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    computedOptions() {
      return [
        { id: 'Aldan', value: 'Aldan' },
        { id: 'Armen', value: 'Armen' },
        { id: 'Harper', value: 'Harper' },
        { id: 'Kama', value: 'Kama' },
        { id: 'Other', value: 'Other' },
      ];
    },
    selectedTypes: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
    computedClass() {
      return this.$attrs.class || 'type-select-container';
    },
  },
};
</script>

<style scoped>
.type-select-container {
  min-width: 250px;
  max-width: 500px;
  height: 50px;
}
</style>
