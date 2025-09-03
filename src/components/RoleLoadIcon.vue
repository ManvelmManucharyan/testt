<template>
  <div
    style="cursor: pointer; display: flex; align-items: center"
    @click="$emit('click')"
  >
    <employment-type-icon :employment-type="role.scheduled_load" />
    <div style="font-size: small">
      {{
        role.scheduled_load !== 'Flex'
          ? role.total_hours
          : role.working_hours_for_flex
      }}
      h
    </div>
  </div>
</template>

<script>
import EmploymentTypeIcon from '@/components/EmploymentTypeIcon.vue';

export default {
  components: {
    EmploymentTypeIcon,
  },
  props: {
    role: {
      type: Object,
      required: true,
    },
  },
  emits: ['click'],
};
</script>
