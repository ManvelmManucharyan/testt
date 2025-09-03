<template>
  <div v-if="isLoading">{{ $t('loading') }}</div>
  <n-layout v-else has-sider class="app">
    <sidebar-vue class="side-bar" />
    <n-layout>
      <nav-bar class="nav-bar" />
      <router-view class="main-page"></router-view>
    </n-layout>
  </n-layout>
</template>

<script>
import { mapStores } from 'pinia';
import { useMeStore } from '@/store/me';
import { useStaticChoicesStore } from '@/store/staticChoices';
import SidebarVue from '@/pages/index/components/Sidebar.vue';
import NavBar from '@/pages/index/components/NavBar.vue';

export default {
  components: {
    SidebarVue,
    NavBar,
  },
  computed: {
    ...mapStores(useMeStore, useStaticChoicesStore),
    isLoading() {
      return this.meStore.isLoading || this.staticChoicesStore.isLoading;
    },
  },
  async created() {
    await this.meStore.fetch();
    await this.staticChoicesStore.fetch();
  },
};
</script>

<style scoped>
.side-bar {
  z-index: 1000;
}
.nav-bar {
  position: sticky;
  top: 0;
  height: 51px;
  z-index: 999;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.main-page {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 95px);
  overflow-x: auto;
}

.content {
  max-width: 800px;
  width: 100%;
  text-align: center;
}
</style>
