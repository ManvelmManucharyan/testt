<template>
  <div class="employee-avatar-container">
    <component
      :is="link ? 'router-link' : 'div'"
      v-bind="linkProps"
      class="employee-link"
    >
      <div class="avatar-wrapper" :style="avatarWrapperStyle">
        <n-avatar v-if="showAvatar" :src="employee.avatar" :size="size" round />
        <span
          v-if="showAvatar && isDeactivated"
          class="status-dot"
          :style="dotStyle"
        />
      </div>

      <span v-if="showName" class="employee-name">
        {{ employee.full_name }}
      </span>
    </component>
  </div>
</template>

<script>
import { NAvatar } from 'naive-ui';

export default {
  name: 'EmployeeAvatar',
  components: { NAvatar },

  props: {
    employee: { type: Object, required: true },
    showName: { type: Boolean, default: true },
    size: { type: [String, Number], default: 40 },
    showAvatar: { type: Boolean, default: true },
    link: { type: Boolean, default: true },
    target: { type: String, default: '_blank' },
  },

  computed: {
    isDeactivated() {
      const { date_of_dismissal } = this.employee;
      return (
        !!date_of_dismissal &&
        new Date(date_of_dismissal).getTime() <= Date.now()
      );
    },

    sizePx() {
      return typeof this.size === 'number' ? `${this.size}px` : this.size;
    },
    avatarWrapperStyle() {
      return { width: this.sizePx, height: this.sizePx };
    },
    dotStyle() {
      const base =
        typeof this.size === 'number'
          ? this.size
          : parseInt(this.size, 10) || 40;
      const d = Math.max(6, Math.round(base * 0.25));
      return { width: `${d}px`, height: `${d}px` };
    },

    linkProps() {
      return this.link
        ? {
            to: this.employeeLink(this.employee),
            target: this.target,
            replace: true,
          }
        : {};
    },
  },

  methods: {
    employeeLink(employee) {
      return {
        name: 'employees-page-detail',
        params: { employeeId: employee.id },
        query: { ...this.$route.query },
      };
    },
  },
};
</script>

<style scoped>
.employee-avatar-container {
  display: inline-flex;
  align-items: center;
}

.employee-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.employee-name {
  margin-left: 8px;
}

.avatar-wrapper {
  position: relative;
  display: inline-flex;
}

.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #f44336;
  border: 2px solid #fff;
  border-radius: 50%;
  pointer-events: none;
}
</style>
