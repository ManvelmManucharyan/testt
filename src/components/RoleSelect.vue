<template>
  <div :class="computedClass">
    <n-select
      v-model:value="selectedRoles"
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
import { getRoles } from '@/api/offerRoles';

export default {
  name: 'RoleSelect',
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
      return this.placeholder || this.$t('selectRole');
    },
    selectedRoles: {
      get() {
        if (!this.isLoading) {
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
            return this.modelValue;
          }
        }
        return null;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
    computedClass() {
      return this.$attrs.class ? this.$attrs.class : 'role-select-container';
    },
  },
  async created() {
    this.options = await getRoles();
    this.isLoading = false;
  },
};
</script>

<style scoped>
.role-select-container {
  min-width: 250px;
  max-width: 500px;
}
</style>
