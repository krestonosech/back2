<template>
  <div>
    <div>
      <p>Почта</p>
      <input type="text" v-model="email">
    </div>
    <div>
      <p>Полное имя</p>
      <input type="text" v-model="fio">
    </div>
    <div>
      <p>Телефон</p>
      <input type="text" v-model="phone">
    </div>
    <div>
      <p>Номер лицензии</p>
      <input type="text" v-model="license">
    </div>
    <div>
      <p>Пароль</p>
      <input type="password" v-model="password">
    </div>
    <div>
      <p>Подтвердите пароль</p>
      <input type="password" v-model="confirmPassword">
    </div>
    <v-btn @click="register">Зарегистрироваться</v-btn>
    <v-btn @click="router.push('/auth')">Перейти на авторизацию</v-btn>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import router from '@/router';
import { ref } from 'vue';

const email = ref('')
const fio = ref('')
const phone = ref('')
const license = ref('')
const password = ref('')
const confirmPassword = ref('')

async function register() {
  try {
    if (password.value !== confirmPassword.value || !license.value  || !phone.value  || !fio.value  || !email.value || !password.value) {
      throw Error
    }
    const data = {
      email: email.value,
      full_name: fio.value,
      phone: phone.value,
      license: license.value,
      password: password.value,
    }

    await axios.post('http://localhost:3001/register', data)
    const token = await axios.post('http://localhost:3001/auth', {email: email.value, password: password.value})
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