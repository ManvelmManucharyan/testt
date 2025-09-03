<template>
  <div :class="computedClass">
    <n-select
      v-model:value="selectedClient"
      :options="options"
      :label-field="label"
      :value-field="trackBy"
      :placeholder="placeholder"
      clearable
    />
  </div>
</template>

<script>
import { getClients } from '@/api/clients';

export default {
  name: 'ClientsSelect',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [Array, Object, String, Number],
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: 'name',
    },
    trackBy: {
      type: String,
      default: 'id',
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      options: [],
    };
  },
  computed: {
    computedPlaceholder() {
      return this.placeholder || this.$t('selectClient');
    },
    selectedClient: {
      get() {
        return (
          this.options.find(
            (option) => option[this.trackBy] === this.modelValue,
          )?.name || null
        );
      },
      set(value) {
        const id = value;
        this.$emit('update:modelValue', id);
      },
    },
    computedClass() {
      return this.$attrs.class ? this.$attrs.class : 'client-select-container';
    },
  },
  async created() {
    this.options = await getClients();
  },
};
</script>

<style scoped>
.client-select-container {
  min-width: 250px;
  max-width: 500px;
}
</style>
