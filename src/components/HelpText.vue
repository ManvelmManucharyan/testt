<template>
  <n-tooltip placement="right">
    <template #trigger>
      <n-icon class="help-text-icon">
        <HelpCircleOutline />
      </n-icon>
    </template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <span v-html="sanitizedHtml"></span>
  </n-tooltip>
</template>

<script>
import { NTooltip, NIcon } from 'naive-ui';
import { HelpCircleOutline } from '@vicons/ionicons5';
import DOMPurify from 'dompurify';

export default {
  name: 'TooltipIcon',
  components: {
    NTooltip,
    NIcon,
    HelpCircleOutline,
  },
  props: {
    text: String,
  },
  computed: {
    sanitizedHtml() {
      return DOMPurify.sanitize(this.$t(this.text));
    },
  },
};
</script>

<style>
.help-text-icon {
  font-size: 15px;
  cursor: pointer;
  margin-left: 5px;
}

.n-tooltip {
  width: 250px;
  white-space: normal;
  word-break: break-word;
  background: rgba(97, 97, 97, 0.9);
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  line-height: 22px;
  padding: 5px 16px;
}
</style>
