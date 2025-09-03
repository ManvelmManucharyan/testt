<template>
  <div :class="computedClass">
    <n-select
      v-model:value="selectedEmployees"
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
import { mapStores } from 'pinia';
import { getEmployees } from '@/api/employees';
import { useEmployeesStore } from '@/store/employee';
export default {
  name: 'EmployeeSelect',
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
    activityType: {
      type: String,
      default: 'all',
    },
    label: {
      type: String,
      default: 'full_name',
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
    ...mapStores(useEmployeesStore),
    computedPlaceholder() {
      if (this.isLoading) {
        return this.$t('loading');
      } else {
        return this.placeholder || this.$t('selectEmployee');
      }
    },
    selectedEmployees: {
      get() {
        if (this.isLoading) {
          return null;
        }

        if (this.multiple) {
          if (this.modelValue) {
            if (Array.isArray(this.modelValue)) {
              return this.modelValue.map((item) =>
                typeof item === 'object' ? item[this.trackBy] : item,
              );
            } else {
              return this.modelValue.split(',');
            }
          }
          return [];
        } else {
          return this.modelValue
            ? typeof this.modelValue === 'object'
              ? this.modelValue[this.trackBy]
              : this.modelValue
            : null;
        }
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
    computedClass() {
      return this.$attrs.class
        ? this.$attrs.class
        : 'employee-select-container';
    },
  },
  watch: {
    selectedEmployees(value) {
      if (this.multiple) {
        this.$emit('update:modelValue', value);
      } else {
        this.$emit('update:modelValue', value || null);
      }
    },
  },
  async created() {
    this.options = await getEmployees({ activity_type: this.activityType });
    this.isLoading = false;
  },
};
</script>

<style scoped>
.employee-select-container {
  min-width: 250px;
  max-width: 500px;
}
</style>
