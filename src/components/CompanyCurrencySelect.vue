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
  name: 'CompanyCurrencySelect',
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
        { id: 'EUR', value: 'Euro' },
        { id: 'USD', value: 'US Dollar' },
        { id: 'RUB', value: 'Russian Ruble' },
        { id: 'USDT_TRC', value: 'USDT TRC' },
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
