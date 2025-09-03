<template>
  <div class="form-group-select">
    <label> {{ labelName }}<span v-if="required">*</span> </label>
    <n-select
      v-model:value="selectedValue"
      class="custom-multiselect"
      :options="options"
      label-field="value"
      value-field="id"
      :clearable="true"
      :filterable="false"
      :multiple="false"
      :disabled="disabled"
      placeholder="------------"
    />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: [Array, Object, String, Number],
      default: null,
    },
    options: {
      type: Array,
      required: true,
    },
    labelName: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    selectedValue: {
      get() {
        return this.options.find((option) => option.id == this.modelValue)?.id;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      },
    },
  },
};
</script>
