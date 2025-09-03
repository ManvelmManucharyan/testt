<template>
  <form style="height: auto" @submit.prevent="submitform">
    <div
      v-for="(dept, index) in departmentSelections"
      :key="dept.id"
      class="department-selection"
    >
      <div class="department-section">
        <label>{{ $t('department') }}:</label>
        <department-select v-model="dept.selectedDepartments" />
        <button
          type="button"
          class="remove-button"
          @click="removeDepartment(index)"
        >
          {{ $t('remove') }}
        </button>
      </div>
      <roles-selection v-if="dept.selectedDepartments" :dept="dept" />
    </div>

    <n-button @click="addDepartment">
      {{ $t('addDepartment') }}
    </n-button>
  </form>
</template>

<script>
import RolesSelection from './components/RolesSelection.vue';
import DepartmentSelect from '@/components/DepartmentSelect.vue';

export default {
  components: {
    RolesSelection,
    DepartmentSelect,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      departmentSelections: this.modelValue.length ? [...this.modelValue] : [],
    };
  },
  watch: {
    departmentSelections: {
      handler() {
        this.updateParent();
      },
      deep: true,
    },
  },
  async created() {
    this.addDepartment();
  },
  methods: {
    addDepartment() {
      this.departmentSelections.push({
        selectedDepartments: null,
        roles: [],
      });
      this.updateParent();
    },
    removeDepartment(index) {
      this.departmentSelections.splice(index, 1);
      this.updateParent();
    },
    updateParent() {
      this.$emit('update:modelValue', this.departmentSelections);
    },
    submitform() {
      this.$emit('update:modelValue', this.departmentSelections);
    },
  },
};
</script>

<style scoped>
.department-selection {
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}

.department-section {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.remove-button {
  background-color: red;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 10px;
}
</style>
