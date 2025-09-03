<template>
  <div class="year-select-container">
    <n-select
      v-model:value="internalValue"
      :options="yearOptions"
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
import moment from 'moment';

export default {
  name: 'YearSelect',
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
      default: false,
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
    range: {
      type: Object,
      default: () => ({
        start: new Date().getFullYear() - 2,
        end: new Date().getFullYear() + 2,
      }),
    },
  },
  emits: ['update:modelValue'],
  data() {
    moment.locale(this.$i18n.locale);
    const { start, end } = this.range;
    return {
      yearOptions: Array.from({ length: end - start + 1 }, (_, i) => ({
        id: start + i,
        name: `${start + i}`,
      })),
      internalValue: this.modelValue?.id,
    };
  },
  computed: {
    computedPlaceholder() {
      return this.placeholder || this.$t('selectYear');
    },
  },
  watch: {
    modelValue(newVal) {
      this.internalValue = newVal?.id;
    },
    internalValue(newVal) {
      this.$emit(
        'update:modelValue',
        this.yearOptions.find((year) => year.id == newVal),
      );
    },
  },
};
</script>

<style scoped>
.year-select-container {
  min-width: 250px;
  max-width: 500px;
}
</style>
