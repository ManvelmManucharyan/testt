<template>
  <n-form v-model="formData" class="bonus-form">
    <load-select
      v-model="formData.scheduled_load"
      :multiple="false"
      :label="'value'"
      :placeholder="$t('selectLoad')"
    />
    <n-input-number
      v-if="formData.scheduled_load === 'Flex'"
      v-model:value="formData.working_hours_for_flex"
      class="input"
      :min="0"
      clearable
    />
  </n-form>
</template>

<script>
import LoadSelect from '@/components/LoadSelect.vue';

export default {
  components: {
    LoadSelect,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    formData: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      },
    },
  },
};
</script>

<style scoped>
.input {
  min-width: 250px;
  max-width: 500px;
  height: 50px;
}
</style>
