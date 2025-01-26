<template>
  <div class="auth-wrapper">
    <div class="auth-box">
      <h1 class="title">
        <span v-if="isLoginMode" class="auth-label">Prijava</span>
        <span v-else class="auth-label">Registracija</span>
      </h1>
      <form @submit.prevent="submitForm">
        <div class="input-group">
          <label for="user">Username:</label>
          <input type="text" id="user" v-model="userName" required />
        </div>
        <div class="input-group">
          <label for="pass">Password:</label>
          <input type="password" id="pass" v-model="userPassword" required />
        </div>
        <button type="submit">
          <span v-if="isLoginMode">Prijava</span>
          <span v-else>Registracija</span>
        </button>
      </form>
      <p @click="switchMode" class="switch-mode">
        <span v-if="isLoginMode">Trebate račun? Registrirajte</span>
        <span v-else>Već imate račun? Prijava</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoginMode = ref(true);
const userName = ref('');
const userPassword = ref('');
const switchMode = () => {
  isLoginMode.value = !isLoginMode.value;
};

const submitForm = async () => {
  try {
    let url;
    if (isLoginMode.value) {
      url = '/api/auth/prijava';
    } else {
      url = '/api/auth/registracija';
    }

    const response = await fetch(`http://localhost:8000${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: userName.value,
        password: userPassword.value,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Došlo je do pogreške');
    }

    if (isLoginMode.value) {
      localStorage.setItem('token', result.token);
      router.push('/tasks');
    } else {
      isLoginMode.value = true;
      userName.value = '';
      userPassword.value = '';
      alert('Registracija uspjela! Molimo prijavite se.');
    }
  } catch (err) {
    alert(err.message);
  }
};
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.auth-box {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
  color: #4caf50;
}

.auth-label {
  display: inline-block;
  padding: 5px 15px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.switch-mode {
  margin-top: 15px;
  text-align: center;
  color: #4caf50;
  cursor: pointer;
}
</style>
