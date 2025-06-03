// server/sendEmail.js
/* eslint-disable no-undef */
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mailjet = require('node-mailjet')

const mailjetClient = mailjet.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post('/send-email', async (req, res) => {
  const { to, firstName, lastName, category, date } = req.body

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px; background-color: #ffffff;">
      <div style="text-align: center;">
        <h2 style="color: #001a2c; margin-bottom: 10px;">AUBL Registration Confirmed</h2>
      </div>
      <p style="font-size: 16px; color: #333;">Dear <strong>${firstName}</strong>,</p>
      <p style="font-size: 15px; color: #333;">
        Thank you for registering for the <strong>Asian University Basketball League</strong>. We are excited to have you with us!
      </p>
      <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #001a2c;">Full Name:</td>
          <td style="padding: 8px;">${firstName} ${lastName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #001a2c;">Category:</td>
          <td style="padding: 8px;">${category}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #001a2c;">Registration Date:</td>
          <td style="padding: 8px;">${date}</td>
        </tr>
      </table>
      <p style="margin-top: 20px; font-size: 15px; color: #333;">
        Please keep this email as your registration confirmation. We look forward to seeing you on the court!
      </p>
      <div style="margin-top: 30px; text-align: center;">
        <a href="https://www.aubl.com/" style="display: inline-block; padding: 10px 20px; background-color: #7fcff7; color: #001a2c; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit AUBL Website</a>
      </div>
      <p style="margin-top: 40px; font-size: 13px; color: #888; text-align: center;">
        © 2025 Asian University Basketball League. All rights reserved.
      </p>
    </div>
  `

  try {
    const request = await mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'dingfeng7777@gmail.com',
            Name: 'AUBL Team',
          },
          To: [
            {
              Email: to,
              Name: `${firstName} ${lastName}`,
            },
          ],
          Subject: 'AUBL Registration Confirmation',
          HTMLPart: htmlContent,
        },
      ],
    })

    console.log('✅ Email sent:', request.body)
    res.status(200).send({ message: 'Email sent successfully' })
  } catch (err) {
    console.error('❌ Email send failed:', err)
    res.status(500).send({ message: 'Failed to send email' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🚀 Mailjet server running on http://localhost:${PORT}`))
