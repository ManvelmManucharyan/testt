<template>
  <n-form-item :label="$t('link')">
    <n-input
      :value="modelValue || ''"
      :placeholder="$t('enterLink')"
      type="url"
      style="width: 100%"
      size="medium"
      @input="$emit('update:modelValue', $event)"
    >
      <template #suffix>
        <n-icon
          v-if="modelValue"
          style="cursor: pointer"
          :title="$t('visitLink')"
          @click.stop="openLink"
        >
          <OpenOutline />
        </n-icon>
      </template>
    </n-input>
  </n-form-item>
</template>

<script>
import { OpenOutline } from '@vicons/ionicons5';

export default {
  components: {
    OpenOutline,
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  methods: {
    openLink() {
      if (this.modelValue) {
        let url = this.modelValue;
        if (!/^https?:\/\//i.test(url)) {
          url = 'https://' + url;
        }
        window.open(url, '_blank');
      }
    },
  },
};
</script>
