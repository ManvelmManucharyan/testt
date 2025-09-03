<template>
  <div class="month-select-container">
    <n-select
      v-model:value="internalValue"
      :options="options"
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
  name: 'MonthSelect',
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
    customMonths: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      internalValue: this.modelValue?.id,
    };
  },
  computed: {
    options() {
      moment.locale(this.$i18n.locale);
      return moment.months().map((month, index) => ({
        id: index + 1,
        name: month,
      }));
    },
    computedPlaceholder() {
      return this.placeholder || this.$t('selectMonth');
    },
  },
  watch: {
    modelValue(newVal) {
      this.internalValue = newVal?.id;
    },
    internalValue(newVal) {
      this.$emit(
        'update:modelValue',
        this.options.find((month) => month.id == newVal),
      );
    },
    '$i18n.locale': {
      handler() {
        this.updateLocale();
      },
      immediate: true,
    },
  },
  methods: {
    updateLocale() {
      moment.locale(this.$i18n.locale);
    },
  },
};
</script>

<style scoped>
.month-select-container {
  min-width: 250px;
  max-width: 500px;
}
</style>
