<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    :show-icon="false"
    :style="modalStyle"
    transform-origin="center"
    :positive-text="$t('save')"
    :negative-text="$t('cancel')"
    @positive-click="onPositiveClick"
    @negative-click="onNegativeClick"
    @close="onClose"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName"></slot>
    </template>
  </n-modal>
</template>

<script>
export default {
  props: {
    modelValue: Boolean,
    modalStyle: Object,
  },
  emits: ['update:show', 'positive-click', 'negative-click', 'close'],
  computed: {
    show: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:show', newValue);
      },
    },
  },
  methods: {
    onPositiveClick() {
      this.$emit('positive-click');
    },
    onNegativeClick() {
      this.$emit('negative-click');
    },
    onClose() {
      this.$emit('close');
    },
  },
};
</script>
