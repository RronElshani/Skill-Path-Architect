import bcrypt from 'bcryptjs'
import config from '../config/index.js'
import userRepository from '../repositories/userRepository.js'
import modelExperimentService from './modelExperimentService.js'

async function ensureDefaultAdmin() {
  const email = config.defaultAdminEmail?.trim().toLowerCase()
  const password = config.defaultAdminPassword

  if (!email || !password) return

  const existing = await userRepository.findByEmail(email)
  if (existing) {
    if (existing.role !== 'admin') {
      await userRepository.updateById(existing._id, { role: 'admin' })
      console.log(`Promoted ${email} to admin.`)
    }
    return
  }

  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)

  await userRepository.create({
    name: config.defaultAdminName,
    email,
    password: hashedPassword,
    role: 'admin',
  })

  console.log(`Default admin account ready: ${email}`)
}

async function promoteConfiguredAdmin() {
  const adminEmail = config.adminEmail?.trim().toLowerCase()
  if (!adminEmail || adminEmail === config.defaultAdminEmail?.trim().toLowerCase()) return

  const user = await userRepository.findByEmail(adminEmail)
  if (!user) return

  if (user.role === 'admin') return

  await userRepository.updateById(user._id, { role: 'admin' })
  console.log(`Promoted ${adminEmail} to admin (ADMIN_EMAIL).`)
}

export async function bootstrapAdmin() {
  await ensureDefaultAdmin()
  await promoteConfiguredAdmin()
  await modelExperimentService.seedInitialExperimentIfEmpty()
}
