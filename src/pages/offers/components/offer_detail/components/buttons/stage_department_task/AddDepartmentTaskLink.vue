<template>
  <tr>
    <td class="task-description">{{ $t('taskDescription') }}</td>
    <td></td>

    <td v-for="stage in stages" :key="stage.id">
      <task-description
        :stage="stage"
        :department="department"
        :task="getTaskForStageAndDepartment(stage, department)"
        @select="onClickOpen"
      ></task-description>
    </td>
  </tr>
  <the-modal
    v-model:show="showDescriptionModal"
    @positive-click="submitTaskDescription"
    @negative-click="closeDescriptionModal"
    @close="closeDescriptionModal"
  >
    <n-card :bordered="false" role="dialog" aria-modal="true">
      <n-input
        v-model:value="text"
        type="textarea"
        placeholder="Basic Textarea"
      />
    </n-card>
  </the-modal>
</template>

<script>
import { mapStores } from 'pinia';
import { useOfferStageDepartmentsStore } from '@/store/offerStageDepartments';
import TaskDescription from '@/pages/offers/components/offer_detail/components/buttons/stage_department_task/components/TaskDescription.vue';
import TheModal from '@/components/TheModal.vue';

export default {
  components: { TaskDescription, TheModal },
  props: {
    department: {
      type: Object,
      required: true,
    },
    stages: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      text: '',
      selectedStage: null,
      selectedOfferDeapartmentStage: null,
      showDescriptionModal: false,
    };
  },
  computed: {
    ...mapStores(useOfferStageDepartmentsStore),
  },
  methods: {
    async onClickOpen(stage, offerDepartmentStage) {
      this.selectedStage = stage;
      this.selectedOfferDeapartmentStage = offerDepartmentStage || null;

      this.text = offerDepartmentStage?.task || '';
      this.showDescriptionModal = true;
    },
    async submitTaskDescription() {
      await this.offerStageDepartmentsStore.update(
        this.$route.params.offerId,
        this.selectedOfferDeapartmentStage.id,
        {
          task: this.text,
        },
      );
      await this.offerStageDepartmentsStore.fetch(this.$route.params.offerId);
      this.showDescriptionModal = false;
      this.text = '';
    },
    closeDescriptionModal() {
      this.showDescriptionModal = false;
      this.text = '';
    },
    getTaskForStageAndDepartment(stage, department) {
      const stageDepartment = this.offerStageDepartmentsStore.data.find(
        (el) => el.offer_stage == stage.id && el.department == department.name,
      );
      return stageDepartment?.task || '';
    },
  },
};
</script>
