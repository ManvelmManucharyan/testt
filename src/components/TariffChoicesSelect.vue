<template>
  <div :class="computedClass">
    <n-select
      v-model:value="selectedTypes"
      :options="computedOptions"
      :label-field="label"
      :value-field="trackBy"
      :clearable="allowEmpty"
      :filterable="searchable"
      :multiple="multiple"
      :placeholder="computedPlaceholder"
      :max-tag-count="max"
    />
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useStaticChoicesStore } from '@/store/staticChoices';
export default {
  name: 'TariffChoicesSelect',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [Array, Object, String, Number],
      default: null,
    },
    allowEmpty: {
      type: Boolean,
      default: true,
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: 'name',
    },
    trackBy: {
      type: String,
      default: 'id',
    },
  },
  emits: ['update:modelValue'],
  computed: {
    ...mapStores(useStaticChoicesStore),

    computedPlaceholder() {
      return this.placeholder || this.$t('selectTariff');
    },

    computedOptions() {
      return this.staticChoicesStore.data?.tariff_choices || [];
    },

    selectedTypes: {
      get() {
        if (this.multiple) {
          if (this.modelValue) {
            return Array.isArray(this.modelValue)
              ? this.modelValue
              : this.modelValue.split(',');
          }
          return [];
        }
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },

    computedClass() {
      return this.$attrs.class ? this.$attrs.class : 'tariff-select-container';
    },
  },
};
</script>

<style scoped>
.tariff--select-container {
  min-width: 250px;
  max-width: 500px;
}
</style>
