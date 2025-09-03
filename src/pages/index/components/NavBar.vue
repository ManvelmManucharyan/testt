<template>
  <nav class="navbar">
    <actions-dropdown />
    <language-selector />
    <user-icon />
  </nav>
</template>

<script>
import LanguageSelector from './LanguageSelector.vue';
import UserIcon from './UserIcon.vue';
import ActionsDropdown from '@/pages/index/components/ActionsDropdown.vue';

export default {
  name: 'Navbar',
  components: {
    UserIcon,
    LanguageSelector,
    ActionsDropdown,
  },
};
</script>

<style scoped>
.navbar {
  background-color: #343a40 !important;
  display: flex;
  align-items: center;
  padding: 9px 15px;
  justify-content: flex-end;
  color: white;
  min-height: 31px;
  gap: 30px;
}
</style>
