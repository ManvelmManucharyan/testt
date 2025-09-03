<template>
  <n-date-picker
    :type="type"
    :value="internalTimestamp"
    :is-date-disabled="isDateDisabled"
    :format="format"
    :placeholder="placeholder"
    :disabled="disabled"
    :first-day-of-week="0"
    @update:value="onUpdateTimestamp"
  />
</template>

<script>
export default {
  name: 'DateSelect',
  props: {
    modelValue: {
      type: [Date, Number, String],
      default: null,
    },
    type: {
      type: String,
      default: 'date',
    },
    isDateDisabled: {
      type: Function,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    format: {
      type: String,
      default: 'dd/MM/yyyy',
    },
  },
  emits: ['update:modelValue'],
  computed: {
    internalTimestamp() {
      if (!this.modelValue) return null;

      const date = new Date(this.modelValue);
      return Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds(),
      );
    },
  },
  methods: {
    onUpdateTimestamp(timestamp) {
      if (timestamp === null) {
        this.$emit('update:modelValue', null);
        return;
      }

      const date = new Date(timestamp);
      const utcDate = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
          date.getMilliseconds(),
        ),
      );

      this.$emit('update:modelValue', utcDate);
    },
  },
};
</script>
