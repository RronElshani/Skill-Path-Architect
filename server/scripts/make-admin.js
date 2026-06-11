import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const connectDB = (await import('../src/config/db.js')).default
const userRepository = (await import('../src/repositories/userRepository.js')).default

const email = process.argv[2]?.trim().toLowerCase()

if (!email) {
  console.error('Usage: npm run make-admin -- <email>')
  process.exit(1)
}

await connectDB()

const user = await userRepository.findByEmail(email)
if (!user) {
  console.error(`No user found with email: ${email}`)
  console.error('Register that account in the app first, then run this command again.')
  process.exit(1)
}

const updated = await userRepository.updateById(user._id, { role: 'admin' })
console.log(`Promoted ${updated.email} to admin.`)
process.exit(0)
