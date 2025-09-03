<template>
  <n-dropdown :options="options" trigger="click" @select="handleSelect">
    <n-icon style="cursor: pointer" :size="30"><PersonCircleOutline /></n-icon>
  </n-dropdown>
</template>

<script>
import { mapStores } from 'pinia';
import { useMeStore } from '@/store/me';
import {
  LogOutOutline,
  PersonCircleOutline,
  SettingsOutline,
} from '@vicons/ionicons5';
import { NIcon, NText } from 'naive-ui';
import { h } from 'vue';

export default {
  components: {
    NIcon,
    PersonCircleOutline,
  },
  computed: {
    ...mapStores(useMeStore),
    options() {
      return [
        {
          key: 'name',
          type: 'render',
          render: this.renderCustomHeader,
        },
        {
          type: 'divider',
        },
        {
          label: this.$t('settings'),
          key: 'settings',
          icon: this.renderIcon(SettingsOutline),
        },
        {
          label: this.$t('logout'),
          key: 'logout',
          icon: this.renderIcon(LogOutOutline),
        },
      ];
    },
  },
  methods: {
    renderIcon(icon) {
      return () => h(NIcon, null, { default: () => h(icon) });
    },
    renderCustomHeader() {
      return h(
        'div',
        {
          style: 'display: flex; align-items: center; padding: 8px 12px;',
        },
        [
          h('div', null, [
            h('div', null, [
              h(
                NText,
                { depth: 2 },
                { default: () => `${this.meStore.data.first_name}` },
              ),
            ]),
          ]),
        ],
      );
    },
    handleSelect(key) {
      if (key === 'logout') {
        this.logout();
      }
      if (key === 'settings') {
        window.open(this.$backendUrl, '_blank');
      }
    },
    logout() {
      localStorage.clear();
      window.location.reload();
    },
  },
};
</script>
