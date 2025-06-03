<template>
  <div class="page-container">
    <div class="glow-bar left"></div>
    <div class="glow-bar right"></div>
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
          <select
            v-model="formData.date"
            @change="handleDateChange"
            :class="{ 'input-error': errors.date }"
          >
            <option disabled value="">Select a date</option>
            <option v-for="date in availableDates" :key="date" :value="date">
              {{ formatDateDisplay(date) }}
            </option>
          </select>
          <span v-if="errors.date" class="error-message">{{ errors.date }}</span>
        </div>

        <div class="form-group" v-if="availableGames.length > 0">
          <label class="bebas-neue-regular">Game(比赛场次) <span class="required">*</span></label>
          <select
            v-model="formData.category"
            @change="validateCategory"
            :class="{ 'input-error': errors.category }"
          >
            <option disabled value="">Select a game</option>
            <option
              v-for="game in availableGames"
              :key="game.id"
              :value="game.Time + ' - ' + game.Team"
            >
              {{ game.Time }} - {{ game.Team }}
            </option>
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
              <h2 class="bebas-neue-regular invitation-subtitle">官方邀请函</h2>
            </div>

            <div class="invitation-content">
              <p class="invitation-greeting">
                Dear
                <span class="invitation-name">{{ formData.firstName }} {{ formData.lastName }}</span
                >,
              </p>
              <p class="invitation-greeting-cn">
                尊敬的
                <span class="invitation-name">{{ formData.lastName }}{{ formData.firstName }}</span
                >:
              </p>

              <div class="invitation-text">
                <p class="en">
                  We are pleased to invite you to the
                  <strong>Asian University Basketball League</strong> event. Your registration has
                  been confirmed for the
                  <strong class="highlight-text">{{ getCategoryName(formData.category) }}</strong>
                  on <strong class="highlight-text">{{ formatDate(formData.date) }}</strong
                  >.
                </p>
                <p class="cn">
                  我们很高兴邀请您参加<strong>亚洲大学生篮球联赛</strong>。您已成功注册
                  <strong class="highlight-text">{{ formatDateCN(formData.date) }}</strong
                  >的
                  <strong class="highlight-text">{{ getCategoryName(formData.category) }}</strong
                  >比赛。
                </p>
              </div>

              <div class="invitation-details">
                <p class="en">
                  Please bring this invitation with you to the event. A confirmation email has also
                  been sent to <span class="highlight-text">{{ formData.email }}</span
                  >.
                </p>
                <p class="cn">
                  请在比赛当天携带此邀请函。确认邮件已发送至<span class="highlight-text">{{
                    formData.email
                  }}</span
                  >。
                </p>
              </div>
            </div>

            <div class="invitation-footer">
              <div class="qr-code">
                <img class="qr-image" src="@/assets/QRCODE.jpg" alt="QR Code" />
                <p class="en">Scan for event details</p>
                <p class="cn">扫码获取赛事详情</p>
              </div>
              <div class="invitation-signature">
                <img src="./assets/signature.png" alt="Signature" class="signature-image" />
                <p class="signature-line"></p>
                <p class="en">AUBL Committee</p>
                <p class="cn">亚洲大学生篮球联赛组委会</p>
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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

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
      gameInfo: [
        {
          id: 1,
          Date: '2025-08-18',
          Time: '11:30:00',
          Team: '延世大学 vs 太原理工大学(Yonsei vs TYUT)',
        },
        {
          id: 2,
          Date: '2025-08-18',
          Time: '14:00:00',
          Team: '北京大学 vs 香港大学(PKU vs HKU)',
        },
        {
          id: 3,
          Date: '2025-08-18',
          Time: '17:00:00',
          Team: '清华大学 vs 建国大学(THU vs Konkuk)',
        },
        {
          id: 4,
          Date: '2025-08-18',
          Time: '19:30:00',
          Team: '浙江大学 vs 东国大学(ZJU vs Dongguk)',
        },
        {
          id: 5,
          Date: '2025-08-19',
          Time: '11:30:00',
          Team: '台湾政治大学 vs 延世大学(NCCU vs Yonsei)',
        },
        {
          id: 6,
          Date: '2025-08-19',
          Time: '14:00:00',
          Team: '日本体育大学 vs 浙江大学(NSSU vs ZJU)',
        },
        {
          id: 7,
          Date: '2025-08-19',
          Time: '17:00:00',
          Team: '上海交通大学 vs 清华大学(SJTU vs THU)',
        },
        {
          id: 8,
          Date: '2025-08-19',
          Time: '19:30:00',
          Team: '白鸥大学 vs 北京大学(HAKUOH vs PKU)',
        },
        {
          id: 9,
          Date: '2025-08-20',
          Time: '11:00:00',
          Team: '东国大学 vs 日本体育大学(Dongguk vs NSSU)',
        },
        {
          id: 10,
          Date: '2025-08-20',
          Time: '14:00:00',
          Team: '香港大学 vs 白鸥大学(HKU vs HAKUOH)',
        },
        {
          id: 11,
          Date: '2025-08-20',
          Time: '17:00:00',
          Team: '建国大学 vs 上海交通大学(Konkuk vs SJTU)',
        },
        {
          id: 12,
          Date: '2025-08-20',
          Time: '19:30:00',
          Team: '太原理工大学 vs 台湾政治大学(TYUT vs NCCU)',
        },
      ],
      availableDates: [],
      availableGames: [],
    }
  },
  mounted() {
    // 提取所有不同的日期值
    this.availableDates = [...new Set(this.gameInfo.map((g) => g.Date))]
    console.log('Available date:', this.availableDates)
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
      this.errors.category = this.formData.category ? '' : 'Please select a game'
    },
    handleDateChange() {
      this.formData.category = ''
      console.log('picked date:', this.formData.date)

      this.availableGames = this.gameInfo.filter((g) => g.Date === this.formData.date)
      console.log('selected game info:', this.availableGames)

      this.validateDate()
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

      try {
        // 检查唯一性
        const { data, error } = await supabase
          .from('aubl_registrations')
          .select('first_name, last_name, email')

        if (error) {
          console.error('验证唯一性时出错:', error)
          this.showSubmitStatus('error', 'Failed to validate uniqueness.')
          this.isSubmitting = false
          return
        }

        // 先检查邮箱是否已存在
        const emailExists = data.some((r) => r.email.toLowerCase().trim() === email)
        if (emailExists) {
          this.showSubmitStatus('error', 'This email has already been registered.')
          this.isSubmitting = false
          return
        }

        // 再检查姓名是否已存在
        const nameExists = data.some(
          (r) =>
            r.first_name.toLowerCase().trim() === first &&
            r.last_name.toLowerCase().trim() === last,
        )
        if (nameExists) {
          this.showSubmitStatus('error', 'This name has already been registered.')
          this.isSubmitting = false
          return
        }

        // 插入新记录
        const { error: insertError } = await supabase.from('aubl_registrations').insert({
          first_name: this.formData.firstName,
          last_name: this.formData.lastName,
          email: this.formData.email,
          registration_date: this.formData.date,
          category: this.formData.category,
        })

        if (insertError) {
          console.error('插入数据时出错:', insertError)

          // 更详细地处理插入错误
          if (insertError.code === '23505') {
            // PostgreSQL 唯一性约束违反错误码
            if (insertError.message.includes('email')) {
              this.showSubmitStatus('error', 'This email has already been registered.')
            } else if (
              insertError.message.includes('first_name') ||
              insertError.message.includes('last_name')
            ) {
              this.showSubmitStatus('error', 'This name has already been registered.')
            } else {
              this.showSubmitStatus('error', 'This registration already exists.')
            }
          } else if (insertError.code === '409' || insertError.status === 409) {
            // HTTP 409 Conflict
            // 尝试从错误消息中提取更详细的信息
            if (insertError.message && insertError.message.toLowerCase().includes('email')) {
              this.showSubmitStatus('error', 'This email has already been registered.')
            } else if (
              insertError.message &&
              (insertError.message.toLowerCase().includes('name') ||
                insertError.message.toLowerCase().includes('first') ||
                insertError.message.toLowerCase().includes('last'))
            ) {
              this.showSubmitStatus('error', 'This name has already been registered.')
            } else {
              this.showSubmitStatus('error', 'A registration with this information already exists.')
            }
          } else {
            // 其他类型的错误
            this.showSubmitStatus(
              'error',
              'Submission failed: ' + (insertError.message || 'Database error'),
            )
          }

          this.isSubmitting = false
          return
        }

        // 尝试发送确认邮件
        try {
          await this.sendConfirmationEmail()
        } catch (emailError) {
          console.error('发送邮件时出错:', emailError)
        }

        // 显示成功消息和邀请函
        this.showSubmitStatus(
          'success',
          'Registered successfully! An email will be sent to you shortly.',
        )
        setTimeout(() => (this.showInvitation = true), 800)
      } catch (err) {
        console.error('表单提交过程中出错:', err)

        // 尝试处理可能是409错误但被捕获为一般错误的情况
        if (err.status === 409 || (err.message && err.message.includes('409'))) {
          if (err.message && err.message.toLowerCase().includes('email')) {
            this.showSubmitStatus('error', 'This email has already been registered.')
          } else if (err.message && err.message.toLowerCase().includes('name')) {
            this.showSubmitStatus('error', 'This name has already been registered.')
          } else {
            this.showSubmitStatus('error', 'A registration with this information already exists.')
          }
        } else {
          this.showSubmitStatus(
            'error',
            'An error occurred during submission: ' + (err.message || 'Unknown error'),
          )
        }
      } finally {
        this.isSubmitting = false
      }
    },
    async sendConfirmationEmail() {
      try {
        const res = await fetch(`${apiBaseUrl}/send-email`, {
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
      // 用于邀请函显示的英文日期格式
      if (!dateStr) return ''

      try {
        // 假设dateStr格式为 "YYYY-MM-DD"
        const date = new Date(dateStr)

        // 检查日期是否有效
        if (isNaN(date.getTime())) {
          console.warn('invalidate value:', dateStr)
          return dateStr // 如果无效，直接返回原始字符串
        }

        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      } catch (err) {
        console.error('date format error:', err)
        return dateStr // 出错时返回原始字符串
      }
    },
    formatDateCN(dateStr) {
      // 用于邀请函显示的中文日期格式
      if (!dateStr) return ''

      try {
        const date = new Date(dateStr)

        if (isNaN(date.getTime())) {
          return dateStr
        }

        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })
      } catch (err) {
        console.error('date format error:', err)
        return dateStr
      }
    },
    formatDateDisplay(dateStr) {
      // 用于下拉菜单显示的日期格式
      if (!dateStr) return ''

      try {
        // 日期已经是YYYY-MM-DD格式，可以直接返回或格式化
        const date = new Date(dateStr)

        if (isNaN(date.getTime())) {
          return dateStr
        }

        // 返回更友好的日期格式，例如: "2025年8月18日 (星期一)"
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        }

        return date.toLocaleDateString('zh-CN', options)
      } catch (err) {
        console.error('date format error:', err)
        return dateStr
      }
    },
    getCategoryName(value) {
      // 如果value本身就是Team信息，直接返回
      if (value && value.includes(' - ')) {
        return value
      }

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
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(to right, #003a5c, #001a2c 40%, #001a2c 60%, #003a5c); /* 渐变 */
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

.glow-bar {
  position: absolute;
  top: 0;
  height: 100%;
  width: 200px;
  z-index: 0;
  background: radial-gradient(ellipse at center, rgba(0, 191, 255, 0.5), transparent 70%);
  filter: blur(80px);
  opacity: 0.7;
}

.glow-bar.left {
  left: -80px;
  transform: rotate(-20deg);
}

.glow-bar.right {
  right: -80px;
  transform: rotate(20deg);
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
