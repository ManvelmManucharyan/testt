<template>
  <div class="activity-select-container">
    <n-select
      v-model:value="selectedTypes"
      :options="options"
      label-field="value"
      value-field="id"
      :placeholder="placeholder"
      clearable
    />
  </div>
</template>

<script>
export default {
  name: 'EmployeeActivitySelect',
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
  data() {
    return {
      options: [
        { id: 'active', value: this.$t('active') },
        { id: 'all', value: this.$t('all') },
      ],
    };
  },
  computed: {
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
.activity-select-container {
  min-width: 250px;
  max-width: 500px;
}
</style>
