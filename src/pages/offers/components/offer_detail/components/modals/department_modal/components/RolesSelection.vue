<template>
  <div class="roles-section">
    <table class="roles-table">
      <thead>
        <tr>
          <th>{{ $t('role') }}</th>
          <th>{{ $t('quantity') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(role, roleIndex) in dept.roles" :key="role.id">
          <td>
            <role-select v-model="role.selectedRole" />
          </td>
          <td>
            <input
              v-model.number="role.quantity"
              type="number"
              min="1"
              :placeholder="$t('quantity')"
              :disabled="!role.selectedRole"
            />
          </td>
          <td>
            <n-icon
              style="cursor: pointer"
              :size="20"
              @click="removeRole(dept, roleIndex)"
            >
              <trash />
            </n-icon>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <n-button size="small" @click="addRole(dept)">
              {{ $t('addRole') }}
            </n-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import RoleSelect from '@/components/RoleSelect.vue';
import { Trash } from '@vicons/ionicons5';

export default {
  components: {
    RoleSelect,
    Trash,
  },
  props: {
    dept: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    addRole(dept) {
      dept.roles.push({
        selectedRole: null,
        quantity: 1,
      });
    },
    removeRole(dept, roleIndex) {
      dept.roles.splice(roleIndex, 1);
    },
  },
};
</script>

<style scoped>
.roles-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.roles-table th,
.roles-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.roles-table th {
  background-color: #f2f2f2;
}
</style>
