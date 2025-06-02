<template>
  <div class="page-container">
    <!-- Logo 区域 -->
    <div class="logo-container">
      <img src="./assets/AUBL_Logo_Horizontal.jpg" alt="AUBL Logo" class="logo-image" />
    </div>

    <div class="form-container">
      <div class="form-title">
        <h1 class="bebas-neue-regular">亚洲大学生篮球联赛邀请函注册</h1>
        <h2 class="bebas-neue-regular">Asian University Basketball League Invitation Register</h2>
      </div>

      <form class="custom-form" @submit.prevent="submitForm">
        <!-- 表单输入 -->
        <div class="form-group">
          <label class="bebas-neue-regular">First Name(名) <span class="required">*</span></label>
          <input
            v-model="formData.firstName"
            placeholder="Enter your first name"
            @input="validateFirstName"
            :class="{ 'input-error': errors.firstName }"
          />
          <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
        </div>

        <div class="form-group">
          <label class="bebas-neue-regular">Last Name(姓) <span class="required">*</span></label>
          <input
            v-model="formData.lastName"
            placeholder="Enter your last name"
            @input="validateLastName"
            :class="{ 'input-error': errors.lastName }"
          />
          <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
        </div>

        <div class="form-group">
          <label class="bebas-neue-regular">Email(邮箱地址) <span class="required">*</span></label>
          <input
            type="email"
            v-model="formData.email"
            placeholder="Enter your email address"
            @input="validateEmail"
            :class="{ 'input-error': errors.email }"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label class="bebas-neue-regular">Date(观赛日期) <span class="required">*</span></label>
          <input
            type="date"
            v-model="formData.date"
            @change="validateDate"
            :class="{ 'input-error': errors.date }"
          />
          <span v-if="errors.date" class="error-message">{{ errors.date }}</span>
        </div>

        <div class="form-group">
          <label class="bebas-neue-regular">Game(比赛场次) <span class="required">*</span></label>
          <select
            v-model="formData.category"
            @change="validateCategory"
            :class="{ 'input-error': errors.category }"
          >
            <option value="" disabled selected>Select a category</option>
            <option value="option1">Elite Division</option>
            <option value="option2">Competitive Division</option>
            <option value="option3">Open Division</option>
          </select>
          <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
        </div>

        <!-- 按钮 -->
        <div class="button-group">
          <button type="button" class="btn clear-btn bebas-neue-regular" @click="resetForm">
            CLEAR
          </button>
          <button type="submit" class="btn submit-btn bebas-neue-regular" :disabled="isSubmitting">
            {{ isSubmitting ? 'SUBMITTING...' : 'SUBMIT' }}
          </button>
        </div>

        <!-- 邀请函展示 -->
        <div v-if="showInvitation" class="invitation-container">
          <div class="invitation-card" ref="invitationCard">
            <div class="invitation-header">
              <img
                src="./assets/AUBL_Logo_Horizontal.jpg"
                alt="AUBL Logo"
                class="invitation-logo"
              />
              <h1 class="bebas-neue-regular invitation-title">OFFICIAL INVITATION</h1>
            </div>

            <div class="invitation-content">
              <p class="invitation-greeting">
                Dear
                <span class="invitation-name">{{ formData.firstName }} {{ formData.lastName }}</span
                >,
              </p>
              <p class="invitation-text">
                We are pleased to invite you to the
                <strong>Asian University Basketball League</strong> event. Your registration has
                been confirmed for the
                <strong class="highlight-text">{{ getCategoryName(formData.category) }}</strong> on
                <strong class="highlight-text">{{ formatDate(formData.date) }}</strong
                >.
              </p>
              <p class="invitation-details">
                Please bring this invitation with you to the event. A confirmation email has also
                been sent to <span class="highlight-text">{{ formData.email }}</span
                >.
              </p>
            </div>

            <div class="invitation-footer">
              <div class="qr-code">
                <img class="qr-image" src="@/assets/QRCODE.jpg" alt="QR Code" />
                <p>Scan for event details</p>
              </div>
              <div class="invitation-signature">
                <img src="./assets/signature.png" alt="Signature" class="signature-image" />
                <p class="signature-line"></p>
                <p>AUBL Committee</p>
              </div>
            </div>
            <div class="invitation-watermark">AUBL 2025</div>
          </div>

          <div class="invitation-actions">
            <button class="btn download-btn bebas-neue-regular" @click="downloadInvitation">
              DOWNLOAD INVITATION
            </button>
            <button class="btn back-btn bebas-neue-regular" @click="goBackToForm">
              BACK TO FORM
            </button>
          </div>
        </div>

        <!-- 状态提示 -->
        <div v-if="submitStatus.show" :class="['submit-status', submitStatus.type]">
          {{ submitStatus.message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js'
import html2canvas from 'html2canvas'

const supabaseUrl = 'https://zodtqxwfbqtmvezdfrwh.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZHRxeHdmYnF0bXZlemRmcndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDM5NzksImV4cCI6MjA2NDE3OTk3OX0.W17_rkfIdtwKhFuuNUYMD7O5c2Pnw7nRgUeiSU8sM9I'
const supabase = createClient(supabaseUrl, supabaseKey)

export default {
  name: 'AUBLForm',
  data() {
    return {
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        date: '',
        category: '',
      },
      errors: {
        firstName: '',
        lastName: '',
        email: '',
        date: '',
        category: '',
      },
      isSubmitting: false,
      showInvitation: false,
      submitStatus: {
        show: false,
        type: 'success',
        message: '',
      },
      validEmailDomains: [
        'gmail.com',
        'outlook.com',
        'hotmail.com',
        'yahoo.com',
        'icloud.com',
        'qq.com',
        '163.com',
        '126.com',
        'sina.com',
        'sohu.com',
        'foxmail.com',
        'edu.cn',
        'ac.cn',
        'org.cn',
        'gov.cn',
        'com.cn',
        'net.cn',
        'protonmail.com',
        'zoho.com',
        'yandex.com',
        'mail.com',
        'gmx.com',
        'aol.com',
        'live.com',
        'msn.com',
        'outlook.jp',
        'naver.com',
        'daum.net',
      ],
    }
  },
  methods: {
    validateFirstName() {
      const nameRegex = /^[a-zA-Z\u4e00-\u9fa5\s]+$/
      if (!this.formData.firstName) {
        this.errors.firstName = 'First name is required'
      } else if (!nameRegex.test(this.formData.firstName)) {
        this.errors.firstName = 'Only letters, Chinese characters, and spaces are allowed'
      } else {
        this.errors.firstName = ''
      }
    },
    validateLastName() {
      const nameRegex = /^[a-zA-Z\u4e00-\u9fa5\s]+$/
      if (!this.formData.lastName) {
        this.errors.lastName = 'Last name is required'
      } else if (!nameRegex.test(this.formData.lastName)) {
        this.errors.lastName = 'Only letters, Chinese characters, and spaces are allowed'
      } else {
        this.errors.lastName = ''
      }
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.formData.email) {
        this.errors.email = 'Email is required'
      } else if (!emailRegex.test(this.formData.email)) {
        this.errors.email = 'Invalid email format'
      } else {
        const domain = this.formData.email.split('@')[1]
        if (!this.validEmailDomains.includes(domain)) {
          this.errors.email = 'Uncommon email domain'
        } else {
          this.errors.email = ''
        }
      }
    },
    validateDate() {
      this.errors.date = this.formData.date ? '' : 'Date is required'
    },
    validateCategory() {
      this.errors.category = this.formData.category ? '' : 'Please select a category'
    },
    validateForm() {
      this.validateFirstName()
      this.validateLastName()
      this.validateEmail()
      this.validateDate()
      this.validateCategory()
      return !Object.values(this.errors).some((e) => e !== '')
    },
    async submitForm() {
      if (!this.validateForm()) {
        this.showSubmitStatus('error', 'Please correct the errors before submitting.')
        return
      }

      this.isSubmitting = true
      const email = this.formData.email.toLowerCase().trim()
      const first = this.formData.firstName.toLowerCase().trim()
      const last = this.formData.lastName.toLowerCase().trim()

      const { data, error } = await supabase
        .from('aubl_registrations')
        .select('first_name, last_name, email')
      if (error) {
        this.showSubmitStatus('error', 'Failed to validate uniqueness.')
        this.isSubmitting = false
        return
      }

      const duplicate = data.some(
        (r) =>
          r.email.toLowerCase().trim() === email ||
          (r.first_name.toLowerCase().trim() === first &&
            r.last_name.toLowerCase().trim() === last),
      )

      if (duplicate) {
        this.showSubmitStatus('error', 'Name or email already registered.')
        this.isSubmitting = false
        return
      }

      const { error: insertError } = await supabase.from('aubl_registrations').insert({
        first_name: this.formData.firstName,
        last_name: this.formData.lastName,
        email: this.formData.email,
        registration_date: this.formData.date,
        category: this.formData.category,
      })

      if (insertError) {
        if (insertError.message.includes('unique_email_lower')) {
          this.showSubmitStatus('error', 'This email has already been used.')
        } else if (insertError.message.includes('unique_name_combo')) {
          this.showSubmitStatus('error', 'This name has already registered.')
        } else {
          this.showSubmitStatus('error', 'Submission failed.')
        }
        this.isSubmitting = false
        return
      }

      await this.sendConfirmationEmail()
      this.showSubmitStatus(
        'success',
        'Registered successfully! An email will send to you shortly.',
      )
      setTimeout(() => (this.showInvitation = true), 800)
      this.isSubmitting = false
    },
    async sendConfirmationEmail() {
      try {
        const res = await fetch('http://localhost:3001/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: this.formData.email,
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            category: this.getCategoryName(this.formData.category),
            date: this.formatDate(this.formData.date),
          }),
        })
        if (!res.ok) console.warn('Mail API error:', await res.text())
      } catch (e) {
        console.error('Email send failed:', e)
      }
    },
    downloadInvitation() {
      html2canvas(this.$refs.invitationCard, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = imgData
        link.download = `AUBL_Invitation_${this.formData.lastName}_${this.formData.firstName}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    showSubmitStatus(type, message) {
      this.submitStatus = { show: true, type, message }
      setTimeout(() => (this.submitStatus.show = false), 5000)
    },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    getCategoryName(value) {
      const map = {
        option1: 'Elite Division',
        option2: 'Competitive Division',
        option3: 'Open Division',
      }
      return map[value] || value
    },
    goBackToForm() {
      this.showInvitation = false
      this.resetForm()
    },
    resetForm() {
      this.formData = {
        firstName: '',
        lastName: '',
        email: '',
        date: '',
        category: '',
      }
      this.errors = {
        firstName: '',
        lastName: '',
        email: '',
        date: '',
        category: '',
      }
    },
  },
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: #001a2c;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.bebas-neue-regular {
  font-family: 'Bebas Neue', sans-serif;
  font-weight: 400;
  font-style: normal;
  letter-spacing: 1px;
}

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 40px 20px;
}

.logo-container {
  width: 150px;
  height: auto;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-image {
  max-width: 180px;
  height: auto;
  object-fit: contain;
}

.form-container {
  width: 100%;
  max-width: 500px;
  padding: 40px;
  background-color: #1a2f3e;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
}

.form-title h1 {
  color: #7fcff7;
  font-size: 28px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.form-title h2 {
  color: white;
  font-size: 16px;
  font-weight: normal;
  text-transform: uppercase;
}

.custom-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #7fcff7;
  font-size: 16px;
  text-transform: uppercase;
}

.required {
  color: #ff6b6b;
  margin-left: 4px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  font-size: 16px;
  color: white;
  transition: all 0.3s ease;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #7fcff7;
  box-shadow: 0 0 0 2px rgba(127, 207, 247, 0.2);
}

.form-group select {
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.form-group select option {
  background-color: #1a2f3e;
  color: white;
}

.input-error {
  border-color: #ff6b6b !important;
  background-color: rgba(255, 107, 107, 0.1) !important;
}

.error-message {
  display: block;
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 5px;
}

/* 按钮区域 */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 10px;
}

.btn {
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.clear-btn {
  background-color: transparent;
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
}

.clear-btn:hover:not(:disabled) {
  background-color: rgba(255, 107, 107, 0.1);
}

.submit-btn {
  background-color: #7fcff7;
  color: #001a2c;
}

.submit-btn:hover:not(:disabled) {
  background-color: #5eb8e5;
}

/* 提交状态消息 */
.submit-status {
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
}

.submit-status.success {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.5);
}

.submit-status.error {
  background-color: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.5);
}

/* 邀请函样式 */
.invitation-container {
  width: 100%;
  max-width: 800px;
  margin-top: 40px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.invitation-card {
  padding: 40px;
  position: relative;
  background-color: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
}

.invitation-header {
  text-align: center;
  margin-bottom: 30px;
}

.invitation-logo {
  width: 200px;
  height: auto;
  margin-bottom: 20px;
}

.invitation-title {
  font-size: 32px;
  color: #001a2c;
  font-weight: bold;
}

.invitation-content {
  margin-bottom: 40px;
  font-size: 16px;
  color: #333;
  line-height: 1.6;
}

.highlight-text {
  font-weight: 700;
  color: #1e3a8a;
}

.invitation-greeting {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.invitation-name {
  color: #007acc;
}

.invitation-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid #ccc;
  padding-top: 20px;
}

.qr-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 10px;
}

.qr-placeholder {
  width: 100px;
  height: 100px;
  background: repeating-linear-gradient(45deg, #ccc, #ccc 10px, #eee 10px, #eee 20px);
  margin-bottom: 8px;
}

.invitation-signature {
  text-align: center;
}

.signature-line {
  width: 150px;
  height: 1px;
  background-color: #333;
  margin-bottom: 8px;
}

.invitation-watermark {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  color: rgba(0, 0, 0, 0.08);
  font-weight: bold;
  letter-spacing: 2px;
}

.signature-image {
  max-width: 150px; /* 控制最大宽度，适当缩小 */
  width: 100%; /* 宽度占满容器 */
  height: auto; /* 自动保持比例 */
  object-fit: contain; /* 避免拉伸变形 */
  display: block;
  margin: 0 auto 8px; /* 居中 + 下方留间距 */
}

.invitation-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.download-btn {
  background-color: #4caf50;
  color: white;
}

.download-btn:hover {
  background-color: #388e3c;
}

.back-btn {
  background-color: #607d8b;
  color: white;
}

.back-btn:hover {
  background-color: #455a64;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .form-container {
    padding: 30px 20px;
  }

  .form-title h1 {
    font-size: 22px;
  }

  .invitation-card {
    padding: 20px;
  }

  .invitation-footer {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .invitation-title {
    font-size: 24px;
  }

  .invitation-content {
    font-size: 14px;
  }
}
</style>
