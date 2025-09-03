<template>
  <div :class="computedClass">
    <n-select
      v-model:value="selectedDepartments"
      :options="options"
      :label-field="label"
      :value-field="trackBy"
      :clearable="allowEmpty"
      :filterable="searchable"
      :multiple="multiple"
      :loading="isLoading"
      :disabled="isLoading"
      :placeholder="computedPlaceholder"
      :max-tag-count="max"
    />
  </div>
</template>

<script>
import { getOfferDepartments } from '@/api/offerDepartments';

export default {
  name: 'DepartmentSelect',
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
  data() {
    return {
      options: [],
      isLoading: true,
    };
  },
  computed: {
    computedPlaceholder() {
      return this.placeholder || this.$t('selectDepartment');
    },
    selectedDepartments: {
      get() {
        return this.modelValue;
      },
      set(value) {
        if (this.multiple) {
          const selectedNames = value
            .map((depId) => {
              const dep = this.options.find((opt) => opt.id === depId);
              return dep ? dep.name : null;
            })
            .filter(Boolean);
          this.$emit('update:modelValue', selectedNames);
        } else {
          const selectedDep = this.options.find((opt) => opt.id === value);
          this.$emit(
            'update:modelValue',
            selectedDep ? selectedDep.name : null,
          );
        }
      },
    },
    computedClass() {
      return this.$attrs.class
        ? this.$attrs.class
        : 'department-select-container';
    },
  },
  async created() {
    this.options = await getOfferDepartments(this.$route.params.offerId);
    this.isLoading = false;
  },
};
</script>

<style scoped>
.department-select-container {
  min-width: 250px;
  max-width: 500px;
}
</style>
