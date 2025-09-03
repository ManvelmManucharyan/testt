<template>
  <div :class="computedClass">
    <n-select
      v-model:value="selectedType"
      :options="options"
      label-field="name"
      value-field="id"
      :placeholder="placeholder"
      clearable
    />
  </div>
</template>

<script>
import { getEmploymentTypes } from '@/api/employmentTypes';

export default {
  name: 'PaymentTypeSelect',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Object],
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
  data() {
    return {
      options: [],
    };
  },
  computed: {
    selectedType: {
      get() {
        return this.modelValue?.id || this.modelValue;
      },
      set(value) {
        const selectedEmployment = this.options.find((opt) => opt.id === value);
        this.$emit('update:modelValue', selectedEmployment || value);
      },
    },

    computedClass() {
      return this.$attrs.class || 'type-select-container';
    },
  },
  async created() {
    this.options = await getEmploymentTypes();
  },
};
</script>

<style scoped>
.type-select-container {
  min-width: 250px;
  max-width: 500px;
}
</style>
