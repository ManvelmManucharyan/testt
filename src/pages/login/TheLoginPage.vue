<template>
  <div class="login-container">
    <n-page-header :title="$t('login')">
      <n-form :show-feedback="false" @keydown.enter="onSubmitLogin">
        <n-space vertical size="large" style="width: 100%">
          <n-form-item :label="$t('username')" path="username">
            <n-input
              v-model:value="username"
              type="text"
              placeholder=""
              autocomplete="username"
            />
          </n-form-item>
          <n-form-item :label="$t('password')" path="password">
            <n-input
              v-model:value="password"
              type="password"
              placeholder=""
              autocomplete="password"
            />
          </n-form-item>
          <n-flex style="width: 100%" vertical>
            <n-button :disabled="isDisabled" @click="onSubmitLogin">
              {{ $t('loginButton') }}
            </n-button>
          </n-flex>
        </n-space>
      </n-form>
    </n-page-header>
    <telegram-login-temp
      style="margin-top: 10px"
      mode="callback"
      :telegram-login="telegramUsername"
      @callback="telegramLogin"
    />
  </div>
</template>

<script>
import { login, telegramLogin } from '@/api/auth';
import { setLocalStorageKey } from '@/utils/localStorage';
import { telegramLoginTemp } from 'vue3-telegram-login';

export default {
  components: {
    telegramLoginTemp,
  },
  data() {
    return {
      username: '',
      password: '',
      telegramUsername: import.meta.env.VITE_TELEGRAM_BOT_USERNAME,
    };
  },
  computed: {
    isDisabled() {
      return !this.username.length || !this.password.length;
    },
  },
  methods: {
    async onSubmitLogin() {
      const data = await login({
        username: this.username,
        password: this.password,
      });
      setLocalStorageKey('access', data.access);
      window.location.reload();
    },
    async telegramLogin(user) {
      const data = await telegramLogin({ user });
      setLocalStorageKey('access', data.access);
      window.location.reload();
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  padding: 8px;
  width: 100%;
  max-width: 300px;
}

.buttons {
  display: flex;
  gap: 10px;
}
</style>
