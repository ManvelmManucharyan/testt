<template>
  <employee-avatar
    :employee="employeeData"
    :link="false"
    :show-name="false"
    :title="employeeProject.employee_name"
    :size="avatarSize"
    :style="clickable ? 'cursor: pointer' : null"
    v-on="avatarListeners"
  />
</template>

<script>
import EmployeeAvatar from '@/components/EmployeeAvatar.vue';

export default {
  name: 'EmployeeCellAvatar',
  components: { EmployeeAvatar },

  props: {
    size: {
      type: Number,
      default: 35,
    },
    employeeProject: {
      type: Object,
      required: true,
    },
    role: {
      type: Object,
      default: null,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    employeeData() {
      const ep = this.employeeProject || {};
      return {
        id: ep.employee,
        avatar: ep.employee_avatar,
        full_name: ep.employee_name,
        date_of_dismissal: ep.employee_date_of_dismissal,
      };
    },
    avatarSize() {
      return this.size;
    },
    avatarListeners() {
      return this.clickable ? { click: this.onAvatarClick } : {};
    },
  },

  methods: {
    onAvatarClick() {
      if (!this.clickable) return;

      const offerId = this.$route.params.offerId;
      const newQuery = {
        tab: 'rolesAndStages',
        employee_project: this.employeeProject.id,
      };

      if (
        this.$route.query.tab === newQuery.tab &&
        this.$route.query.employee_project === String(newQuery.employee_project)
      ) {
        return;
      }

      this.$router.push({
        path: `/offers/${offerId}`,
        query: newQuery,
      });
    },
  },
};
</script>
