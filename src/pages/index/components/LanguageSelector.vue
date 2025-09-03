<template>
  <div class="navbar-left">
    <select
      id="language-select"
      v-model="selectedLanguage"
      aria-label="Select Language"
      @change="changeLanguage"
    >
      <option value="en">English</option>
      <option value="ru">Russian</option>
    </select>
  </div>
</template>

<script>
import { setLocalStorageKey, getLocalStorageKey } from '@/utils/localStorage';

export default {
  name: 'LanguageSelector',
  data() {
    return {
      selectedLanguage: getLocalStorageKey('lang') || 'en',
    };
  },
  created() {
    this.$i18n.locale = this.selectedLanguage;
  },
  methods: {
    changeLanguage() {
      this.$i18n.locale = this.selectedLanguage;
      setLocalStorageKey('lang', this.selectedLanguage);
    },
  },
};
</script>

<style scoped>
select {
  padding: 5px 10px;
  border-radius: 4px;
  border: none;
  background-color: #495057;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

select:hover {
  background-color: #6c757d;
}

select:focus {
  outline: none;
  background-color: #6c757d;
}
</style>
