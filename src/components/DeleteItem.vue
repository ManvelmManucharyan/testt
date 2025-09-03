<template>
  <n-popconfirm>
    <template #trigger>
      <n-icon style="cursor: pointer" :size="20">
        <trash />
      </n-icon>
    </template>
    {{ $t('deleteItem') }}
  </n-popconfirm>
</template>

<script>
import { Trash } from '@vicons/ionicons5';

export default {
  components: {
    Trash,
  },
};
</script>
