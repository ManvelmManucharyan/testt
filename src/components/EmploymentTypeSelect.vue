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
  name: 'EmploymentTypeSelect',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Array, Object, Number],
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
    label: {
      type: String,
      default: 'value',
    },
    trackBy: {
      type: String,
      default: 'id',
    },
  },
  emits: ['update:modelValue'],
  computed: {
    computedOptions() {
      return [
        { id: 'Full-time', value: 'Full-time' },
        { id: 'Half-time', value: 'Half-time' },
        { id: 'Part-time', value: 'Part-time' },
        { id: 'Flex', value: 'Flex' },
      ];
    },
    selectedTypes: {
      get() {
        if (this.multiple) {
          return this.modelValue || [];
        } else {
          return this.modelValue || null;
        }
      },
      set(value) {
        // For multiple selection
        if (this.multiple) {
          this.$emit('update:modelValue', value);
        } else {
          // For single selection, emit the id directly
          this.$emit('update:modelValue', value ? value : null);
        }
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
