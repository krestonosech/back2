<template>
  <div>
    <div>
      <p>Почта</p>
      <input type="text" v-model="email">
    </div>
    <div>
      <p>Пароль</p>
      <input type="password" v-model="password">
    </div>
    <v-btn @click="auth">Авторизация</v-btn>
    <v-btn @click="router.push('/')">Перейти на регистрацию</v-btn>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import axios from 'axios';
import { ref } from 'vue';

const email = ref('')
const password = ref('')

async function auth() {
  try {
    if (!email.value || !password.value) {
      throw Error
    }
    const data = {
      email: email.value,
      password: password.value,
    }

    const token = await axios.post('http://localhost:3001/auth', data)
    localStorage.setItem('token', token.data.token)
    localStorage.setItem('user', email.value)
    router.push('/requests')
  } catch (err) {
    console.error('Введите правильные данные')
  }
}
</script>

<style lang="scss" scoped>

</style>