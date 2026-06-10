import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB, { usingInMemoryDb } from '../src/config/db.js'
import userRepository from '../src/repositories/userRepository.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const email = process.argv[2]?.trim().toLowerCase()

if (!email) {
  console.error('Usage: npm run make-admin -- <email>')
  process.exit(1)
}

await connectDB()

if (usingInMemoryDb) {
  console.error(`
Cannot promote users with make-admin while using in-memory MongoDB.
This script opens a separate empty database from your running dev server.

Use one of these instead:

  1. Set ADMIN_EMAIL in server/.env, restart "npm run dev", then sign out and back in:
       ADMIN_EMAIL=${email}

  2. Start persistent MongoDB from the project root, re-register, then rerun make-admin:
       npm run db:start
`)
  process.exit(1)
}

const user = await userRepository.findByEmail(email)
if (!user) {
  console.error(`No user found with email: ${email}`)
  console.error('Register that account in the app first, then run this command again.')
  process.exit(1)
}

const updated = await userRepository.updateById(user._id, { role: 'admin' })
console.log(`Promoted ${updated.email} to admin.`)
process.exit(0)
