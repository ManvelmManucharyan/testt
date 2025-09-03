<template>
  <span
    class="clickable-month"
    :class="{ 'disabled-month': isDisabled }"
    @click="handleClick"
  >
    {{ monthName }}
  </span>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    year: {
      type: [String, Number],
      required: true,
    },
    monthIndex: {
      type: Number,
      required: true,
    },
  },
  emits: ['month-clicked'],
  computed: {
    monthName() {
      return moment()
        .locale(this.$i18n.locale)
        .month(this.monthIndex - 1)
        .format('MMM');
    },
    isDisabled() {
      const currentMonth = moment().month() + 1;
      const currentYear = moment().year();
      const selectedYear = Number(this.year);

      return (
        selectedYear > currentYear ||
        (selectedYear === currentYear && this.monthIndex > currentMonth)
      );
    },
  },
  methods: {
    handleClick() {
      if (!this.isDisabled) {
        this.$emit('month-clicked', this.monthIndex);
      }
    },
  },
};
</script>

<style scoped>
.clickable-month {
  cursor: pointer;
  text-decoration: underline;
  color: blue;
}

.disabled-month {
  pointer-events: none;
  color: gray;
  opacity: 0.5;
  text-decoration: none;
}
</style>
