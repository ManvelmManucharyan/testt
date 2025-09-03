<template>
  <div class="rounding-switcher">
    <n-switch
      :value="roundValues"
      size="small"
      @update:value="handleSwitchChange"
    />
    <span class="switch-label">{{ label }}</span>
  </div>
</template>

<script>
import { setLocalStorageKey, getLocalStorageKey } from '@/utils/localStorage';

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    localStorageKey: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
  },
  emits: ['update:value'],
  computed: {
    roundValues: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update:value', val);
        setLocalStorageKey(this.localStorageKey, JSON.stringify(val));
      },
    },
  },
  created() {
    const savedValue = getLocalStorageKey(this.localStorageKey);
    if (savedValue !== null) {
      this.roundValues = JSON.parse(savedValue);
    }
  },
  methods: {
    handleSwitchChange(val) {
      this.roundValues = val;
    },
  },
};
</script>

<style scoped>
.rounding-switcher {
  display: flex;
  align-items: center;
}

.switch-label {
  margin-left: 4px;
}
</style>
