<template>
  <a style="cursor: pointer" @click="onClickOpen">
    <span :class="{ inactive: !task }">
      <n-popover v-if="task" trigger="hover">
        <template #trigger>
          <span>{{ task }}</span>
        </template>
        <div class="popover-content">
          {{ task }}
        </div>
      </n-popover>

      <span v-else>{{ $t('addTaskDescription') }}</span>
    </span>
  </a>
</template>

<script>
import { mapStores } from 'pinia';
import { useOfferStageDepartmentsStore } from '@/store/offerStageDepartments';

export default {
  props: {
    stage: {
      type: Object,
      required: true,
    },
    department: {
      type: Object,
      required: true,
    },
    task: {
      type: String,
      default: '',
    },
  },
  emits: ['select'],
  computed: {
    ...mapStores(useOfferStageDepartmentsStore),
  },
  methods: {
    async onClickOpen() {
      await this.offerStageDepartmentsStore.fetch(this.$route.params.offerId);

      const task = this.offerStageDepartmentsStore.data.find(
        (el) =>
          el.offer_stage == this.stage.id &&
          el.department == this.department.name,
      );
      this.$emit('select', this.stage, task);
    },
  },
};
</script>
