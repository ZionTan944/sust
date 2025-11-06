<template>
  <div class="login-container">
    <div class="container-fluid h-100">
      <div class="row h-100 justify-content-center align-items-stretch">
        <div class="d-flex flex-column flex-grow-1 justify-content-between p-0 min-vh-100">
          <!-- Welcome Title on Green Background -->
          <div class="flex-grow-1 d-flex align-items-center justify-content-center">
            <h2 class="welcome-title text-center mb-0 display-4 display-md-3 display-lg-2 w-100 fw-normal">Welcome</h2>
          </div>
          <!-- fill width for mobile only -->
          <div class="welcome-card card col-12 col-md-8 mx-auto mb-0">
            <div class="card-body p-4 p-sm-5">
              <form @submit.prevent="handleLogin">
                <!-- Username/Email Field -->
                <div class="form-group mb-5">
                  <label class="form-label fw-semibold fs-5">Username Or Email</label>
                  <div class="input-container">
                    <input
                      type="email"
                      class="form-control custom-input fs-5"
                      v-model="email"
                      placeholder="example@example.com"
                      required
                    />
                  </div>
                </div>
                <!-- Password Field -->
                <div class="form-group mb-5">
                  <label class="form-label fw-semibold fs-5">Password</label>
                  <div class="input-container position-relative">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control custom-input fs-5"
                      v-model="password"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      class="password-toggle"
                      @click="togglePassword"
                    >
                      <font-awesome-icon
                        :icon="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                        class="text-muted"
                        size="lg"
                      />
                    </button>
                  </div>
                </div>
                <!-- Login Button -->
                <div class="d-grid mb-4">
                  <button
                    type="submit"
                    class="btn btn-login py-3 py-sm-4 px-4 px-sm-5 fs-5"
                    :disabled="userStore.loading"
                  >
                    <span v-if="userStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    {{ userStore.loading ? 'Logging in...' : 'Log In' }}
                  </button>
                </div>

                <!-- Error Message -->
                <div v-if="userStore.error" class="alert alert-danger fs-6" role="alert">
                  {{ userStore.error }}
                </div>

                <!-- Forgot Password Link -->
                <div class="text-center mt-4">
                  <a href="#" class="forgot-password-link fs-6">Forgot Password?</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { addToast } from '@/stores/toast.js'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  // Clear any previous errors
  userStore.clearError()

  try {
    const result = await userStore.login(email.value, password.value)

    if (result.success) {
      // console.log('Login success:', result.user)
      addToast("Login Successful", "Success")
      router.push('/operator')
    } else {
      // Error is already set in the store
      // console.error('Login failed:', result.error)
      addToast("Login Failed. Try again later", "Error")
    }
  } catch (error) {
    // Additional error handling if needed
    // console.error('Login error:', error)
    addToast("Login Failed. Try again later", "Error")

  }
}
</script>

<style scoped>

.login-container {
  background: linear-gradient(135deg, #00D09E 0%, #00B888 100%);
  min-height: 100vh;
  position: relative;
}

.welcome-card {
  background: #fff;
  border-radius: 30px 30px 0 0;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
  border: none;
  height: 75vh;
}

.input-container {
  position: relative;
}

.custom-input {
  background-color: #f8f9fa;
  border: none;
  border-radius: 15px;
  padding: 15px 20px;
  font-size: 1rem;
  color: #6c757d;
  transition: all 0.3s ease;
}
.custom-input:focus {
  background-color: #e9ecef;
  box-shadow: 0 0 0 0.2rem rgba(0, 208, 158, 0.25);
  outline: none;
}
.custom-input::placeholder {
  color: #adb5bd;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}
.password-toggle:hover {
  opacity: 0.7;
}

.btn-login {
  background: linear-gradient(135deg, #00D09E 0%, #00B888 100%);
  border: none;
  border-radius: 25px;
  font-weight: 600;
  color: #fff;
  transition: all 0.3s ease;
}
.btn-login:hover {
  background: linear-gradient(135deg, #00B888 0%, #009970 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 208, 158, 0.3);
}
.btn-login:active {
  transform: translateY(0);
}


</style>
