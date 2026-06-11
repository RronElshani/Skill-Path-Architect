import nodemailer from 'nodemailer'

const email = process.env.EMAIL
const emailPass = process.env.EMAIL_PASS

if (!email || !emailPass) {
  throw new Error('EMAIL and EMAIL_PASS environment variables must be configured in .env')
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: email,
    pass: emailPass,
  },
})

export const sendResetCodeEmail = async (toEmail, code) => {
  const subject = 'Reset Your Password - AI Guidance Counselor'
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4f46e5; text-align: center;">AI Guidance Counselor</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password. Please use the verification code below to complete the reset process. This code is valid for 15 minutes.</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; padding: 10px 20px; background-color: #f1f5f9; border-radius: 6px; letter-spacing: 5px; color: #1e293b;">${code}</span>
      </div>
      <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated academic capstone project message.</p>
    </div>
  `

  await transporter.sendMail({
    from: `"AI Guidance Counselor" <${email}>`,
    to: toEmail,
    subject,
    html: htmlContent,
  })
  console.log(`Password reset email sent successfully to ${toEmail}`)
}
