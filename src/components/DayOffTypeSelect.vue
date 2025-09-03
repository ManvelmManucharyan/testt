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
export default {
  name: 'VacationTypeSelectSelect',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [Array, Object, String, Number],
      default: null,
    },
    date: {
      type: [String, Date],
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
      default: 'value',
    },
    trackBy: {
      type: String,
      default: 'id',
    },
  },
  emits: ['update:modelValue'],
  computed: {
    computedPlaceholder() {
      return this.placeholder || this.$t('selectType');
    },
    computedOptions() {
      return [
        { id: 'first_half', value: this.$t('firstHalf') },
        { id: 'second_half', value: this.$t('secondHalf') },
      ];
    },
    selectedTypes: {
      get() {
        if (this.multiple) {
          if (this.modelValue) {
            if (Array.isArray(this.modelValue)) {
              return this.modelValue;
            } else {
              return this.modelValue.split(',');
            }
          } else {
            return [];
          }
        } else {
          const date = new Date(this.date);
          const hours = date.getUTCHours();
          const minutes = date.getUTCMinutes();

          if (hours === 9 && minutes === 0) {
            return 'first_half';
          } else if (hours === 13 && minutes === 30) {
            return 'second_half';
          }
          return null;
        }
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
    computedClass() {
      return this.$attrs.class ? this.$attrs.class : 'type-select-container';
    },
  },
};
</script>

<style scoped>
.type-select-container {
  min-width: 250px;
  max-width: 500px;
}
</style>
