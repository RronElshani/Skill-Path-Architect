import { execSync } from 'child_process'
import net from 'net'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

function isPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    socket.setTimeout(1500)
    socket.once('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.once('timeout', () => {
      socket.destroy()
      resolve(false)
    })
    socket.once('error', () => resolve(false))
    socket.connect(port, host)
  })
}

async function waitForMongo(maxMs = 45000) {
  const start = Date.now()
  while (Date.now() - start < maxMs) {
    if (await isPortOpen(27017)) return true
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  return false
}

if (await isPortOpen(27017)) {
  console.log('MongoDB already running on localhost:27017')
  process.exit(0)
}

console.log('Starting MongoDB with Docker...')
try {
  execSync('docker compose up -d mongodb', { cwd: rootDir, stdio: 'inherit' })
} catch {
  console.warn(
    '\nCould not start Docker MongoDB. Start Docker Desktop and run: npm run db:start\n' +
      'The server will fall back to in-memory MongoDB until a real database is available.\n'
  )
  process.exit(0)
}

if (await waitForMongo()) {
  console.log('MongoDB is ready at mongodb://localhost:27017/ai-guidance-counselor')
} else {
  console.warn('MongoDB container started but port 27017 is not ready yet.')
}
