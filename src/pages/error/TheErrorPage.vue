<template>
  <div class="not-found">
    <h1>{{ $t('title') }}</h1>
    <p>{{ $t('description') }}</p>
    <router-link to="/">{{ $t('goMainPage') }}</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 50px;
}
</style>
