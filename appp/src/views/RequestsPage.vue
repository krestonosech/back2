<template>
  <div>
    <div>
      <p>Дата</p>
      <input type="date" v-model="date">
    </div>
    <div>
      <p>Машина</p>
      <v-autocomplete :items="items" v-model="car"></v-autocomplete>
    </div>
    <v-btn @click="register">Создать заявку</v-btn>
    <v-btn @click="requests">{{ email === 'admin' ? 'Все заявки' : 'Мои заявки'}}</v-btn>
    <div v-if="table">
      <p>{{ email === 'admin' ? 'Все заявки' : 'Мои заявки'}}</p>
      <table>
        <thead>
          <tr>
            <td>id Заявки</td>
            <td>email</td>
            <td>Дата</td>
            <td>Машина</td>
            <td>Полное имя</td>
            <td>Телефон</td>
            <td>Статус</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in table.data.row" :key="item">
            <td>{{ item.id }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.car }}</td>
            <td>{{ item.fio }}</td>
            <td>{{ item.phone }}</td>
            <td><v-autocomplete v-if="email === 'admin'" v-model="statuss" :items="statuses" @update:modelValue="update(statuss, item.id)"/>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import router from '@/router';
import { ref } from 'vue';

const email = localStorage.getItem('user')
const car = ref('')
const date = ref('')
const items = ['Tesla Model Y', 'Toyota Corolla', 'Toyota RAV4']
const table = ref()
const statuss = ref()
const statuses = ['Подтвержденно', 'Удалено', 'Рассматривается']

async function register() {
  try {
    if (!car.value  || !date.value) {
      throw Error
    }
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }

    const data = {
      car: car.value,
      date: date.value,
    }

    await axios.post('http://localhost:3001/request', data, config)
    router.push('/requests')
  } catch (err) {
    console.error('Введите правильные данные')
  }
}

async function requests() {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }

    table.value = await axios.post('http://localhost:3001/requests', {email: email}, config)
  } catch(err) {
    console.error(err);
  }
}

async function update(status: string, id: number) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }

    await axios.post('http://localhost:3001/update', {status: status, id: id}, config)
    table.value = await axios.post('http://localhost:3001/requests', {email: email}, config)
    statuss.value = undefined
  } catch(err) {
    console.error(err);
  }
}
</script>

<style lang="scss" scoped>
td {
  border: solid 1px black;
}
</style>