<template>
  <n-layout-sider
    v-model:collapsed="collapsed"
    class="sidebar"
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="230"
    show-trigger
  >
    <div class="brand-name">
      <img class="logo" src="@/assets/aldan_logo.jpg" alt="Aldan logo" />
      <span v-if="!collapsed">{{ 'AldanDev' }}</span>
    </div>

    <n-menu
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :value="activeMenuKey"
      key-field="key"
      label-field="label"
      @update:value="onMenuSelect"
    />
  </n-layout-sider>
</template>

<script>
import {
  Time,
  PeopleOutline,
  BookmarksOutline,
  PersonSharp,
  Cash,
  BarChart,
} from '@vicons/ionicons5';
import { NIcon } from 'naive-ui';
import { h } from 'vue';
import { setLocalStorageKey, getLocalStorageKey } from '@/utils/localStorage';

export default {
  name: 'Sidebar',
  data() {
    return {
      collapsed: getLocalStorageKey('sidebarCollapsed') ?? false,
    };
  },
  computed: {
    activeMenuKey() {
      const routeName = this.$route.name;
      const routeQuery = this.$route.query;

      const findActiveKey = (options) => {
        for (const option of options) {
          if (
            routeName === 'tracked-times-page' &&
            option.key.startsWith('tracked-times-page:')
          ) {
            const [, groupBy] = option.key.split(':');
            if (routeQuery.group_by === groupBy) {
              return option.key;
            }
          } else if (routeName.startsWith(option.key)) {
            return option.key;
          } else if (option.key === routeName) {
            return option.key;
          }
          if (option.children) {
            const childKey = findActiveKey(option.children);
            if (childKey) {
              return childKey;
            }
          }
        }
        return null;
      };

      return findActiveKey(this.menuOptions) || '';
    },
    menuOptions() {
      return [
        {
          label: this.$t('employees'),
          key: 'employees-page',
          icon: this.renderIcon(PeopleOutline),
        },
        {
          label: this.$t('projects'),
          key: 'projects-page',
          icon: this.renderIcon(BookmarksOutline),
        },
        {
          label: this.$t('hr'),
          key: 'hr',
          icon: this.renderIcon(PersonSharp),
          children: [
            {
              label: this.$t('vacations'),
              key: 'vacations-page',
            },
            {
              label: this.$t('salarySheet'),
              key: 'salary-sheet-page',
            },
          ],
        },
        {
          label: this.$t('accounting'),
          key: 'accounting',
          icon: this.renderIcon(Cash),
          children: [
            {
              label: this.$t('offers'),
              key: 'offers-page',
            },
            {
              label: this.$t('opex'),
              key: 'opex-page',
            },
            {
              label: this.$t('tariffRates'),
              key: 'tariff-rates-page',
            },
            {
              label: this.$t('companies'),
              key: 'companies-page',
            },
            {
              label: this.$t('projectPayments'),
              key: 'project-payments-page',
            },
          ],
        },
        {
          label: this.$t('trakcedHours'),
          key: 'trakced-hours',
          icon: this.renderIcon(Time),
          children: [
            {
              label: this.$t('byUser'),
              key: 'tracked-times-page:user',
            },
            {
              label: this.$t('byProject'),
              key: 'tracked-times-page:project',
            },
            {
              label: this.$t('byDepartment'),
              key: 'tracked-times-page:department',
            },
          ],
        },
        {
          label: this.$t('finance'),
          key: 'finance',
          icon: this.renderIcon(BarChart),
          children: [
            {
              label: this.$t('currencyRates'),
              key: 'currency-rates-page',
            },
            {
              label: this.$t('aldanFixedRates'),
              key: 'aldan-fixed-rates-page',
            },
            {
              label: this.$t('cards'),
              key: 'cards-page',
            },
          ],
        },
      ];
    },
  },
  watch: {
    collapsed(newValue) {
      setLocalStorageKey('sidebarCollapsed', newValue);
    },
  },
  methods: {
    renderIcon(icon) {
      return () => h(NIcon, null, { default: () => h(icon) });
    },
    async onMenuSelect(selectedKey) {
      if (selectedKey.includes('tracked-times-page')) {
        const [routeName, groupBy] = selectedKey.split(':');
        await this.$router.push({
          name: routeName,
          query: { group_by: groupBy },
        });
      } else if (selectedKey !== this.$route.name) {
        await this.$router.push({ name: selectedKey });
      }
    },
  },
};
</script>

<style scoped>
.sidebar {
  background-color: #343a40;
}

.logo {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  margin: 5px;
}

.brand-name {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #6e7279;
}

.brand-name.collapsed {
  font-size: 24px;
}
</style>
