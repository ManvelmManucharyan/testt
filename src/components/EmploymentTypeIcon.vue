<template>
  <span class="circle">
    <span class="fill" :class="fillClass"></span>
    <span v-if="employmentType == 'Flex'" class="circle-text">F</span>
  </span>
</template>

<script>
import { lowerCase } from 'lodash';

export default {
  name: 'EmploymentTypeIcon',
  props: {
    employmentType: {
      type: String,
      required: true,
    },
  },
  computed: {
    fillClass() {
      switch (lowerCase(this.employmentType)) {
        case 'part time':
          return 'fill-25';
        case 'half time':
          return 'fill-50';
        case 'full time':
          return 'fill-100';
        default:
          return '';
      }
    },
  },
};
</script>

<style scoped>
.circle {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #c2c7d0;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  margin: 5px;
}
.fill {
  width: 100%;
  height: 100%;
  background-color: #343a40;
  position: absolute;
  transform-origin: 50% 50%;
}
.fill-25 {
  clip-path: polygon(50% 0%, 50% 50%, 100% 50%, 100% 0%);
}
.fill-50 {
  clip-path: polygon(50% 0%, 50% 100%, 100% 100%, 100% 0%);
}
.fill-100 {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.circle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: white;
  font-weight: bold;
}
</style>
