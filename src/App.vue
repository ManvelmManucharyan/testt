<template>
  <n-config-provider
    :theme-overrides="themeOverrides"
    :locale="locale"
    :date-locale="dateLocale"
  >
    <router-view></router-view>
  </n-config-provider>
</template>

<script>
import { setLocalStorageKey, getLocalStorageKey } from '@/utils/localStorage';
import { enUS, dateEnUS, ruRU, dateRuRU } from 'naive-ui';

export default {
  data() {
    return {
      themeOverrides: {
        Button: {
          color: '#11376b',
          colorDisabled: '#0000001f',
          textColor: '#ffffff',
          colorHover: '#0d284e',
          colorPressed: '#0d284e',
          colorFocus: '#11376b',
          textColorHover: '#ffffff',
          textColorPressed: '#ffffff',
          textColorFocus: '#ffffff',
          borderHover: '#0d284e',
          borderPressed: '#0d284e',
          borderFocus: '#11376b',
          rippleColor: '#0d284e',
        },
        Table: {
          tdColor: '#ffffff',
        },
        Menu: {
          itemHeight: '30px',
          itemTextColorActive: '#ffffff',
          itemTextColorActiveHover: '#ffffff',
          itemTextColor: '#c2c7d0',
          itemTextColorChild: '#c2c7d0',
          itemTextColorChildActive: '#ffffff',
          itemIconColorChildActive: '#ffffff',
          itemIconColor: '#c2c7d0',
          itemIconColorActive: '#ffffff',
          itemIconColorActiveCollapsed: '#ffffff',
          itemIconColorChildActiveCollapsed: '#ffffff',
          itemIconColorActiveHover: '#ffffff',
          itemIconColorChildActiveHover: 'rgb(51, 54, 57)',
          itemTextColorChildActiveHover: 'rgb(51, 54, 57)',
          itemIconColorCollapsed: '#c2c7d0',
          itemColorActive: 'rgba(0, 0, 173, 0.34)',
          itemColorActiveHover: 'rgba(0, 0, 173, 0.52)',
          itemColorActiveCollapsed: 'rgba(0, 0, 173, 0.44)',
          arrowColor: '#c2c7d0',
          arrowColorChildActive: '#ffffff',
          arrowColorChildActiveHover: 'rgb(51, 54, 57)',
        },
        Dropdown: {
          optionTextColorActive: 'rgb(51, 54, 57)',
          optionColorActive: 'rgb(5 45 106 / 31%)',
        },
        Input: {
          caretColor: 'black',
          borderHover: '1px solid #0d284e',
          borderFocus: '1px solid #11376b',
          boxShadowFocus: '0 0 0 2px rgba(0, 88, 151, 0.56)',
        },
        Tabs: {
          barColor: '#11376b',
          tabTextColorActive: '#ffffff',
        },
        DatePicker: {
          itemColorActive: '#0d284e',
        },
        Select: {
          peers: {
            InternalSelection: {
              borderHover: '1px solid #0d284e',
              borderFocus: '1px solid #11376b',
              borderPressed: '#0d284e',
              borderActive: '1px solid #11376b',
              caretColor: 'black',
              loadingColor: '#0d284e',
              boxShadowFocus: '0 0 0 2px rgba(0, 88, 151, 0.56)',
              boxShadowActive: '0 0 0 2px rgba(0, 88, 151, 0.56)',
              optionTextColorActive: 'black',
              textColorActive: 'black',
            },
            InternalMenu: {
              textColorActive: 'black',
            },
          },
        },
        Upload: {
          itemColorHover: 'rgb(221 221 221)',
        },
      },
    };
  },
  computed: {
    locale() {
      return this.$i18n.locale === 'en' ? enUS : ruRU;
    },
    dateLocale() {
      return this.$i18n.locale === 'en' ? dateEnUS : dateRuRU;
    },
  },
  async created() {
    const language = getLocalStorageKey('lang');
    if (language) {
      this.$i18n.locale = language;
    } else {
      this.$i18n.locale = 'en';
      setLocalStorageKey('lang', 'en');
    }
  },
};
</script>
