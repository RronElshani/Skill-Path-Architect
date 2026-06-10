import { spawn } from 'child_process'
import fs from 'fs'
import net from 'net'
import path from 'path'
import { fileURLToPath } from 'url'
import { MongoBinary } from 'mongodb-memory-server-core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const LOCAL_DB_PATH = path.join(__dirname, '../../data/db')
export const LOCAL_DB_PORT = 27018

export function getLocalDbUri(databaseName = 'ai-guidance-counselor') {
  return `mongodb://127.0.0.1:${LOCAL_DB_PORT}/${databaseName}`
}

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

function waitForPort(port, maxMs = 45000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const check = async () => {
      if (await isPortOpen(port)) {
        resolve(true)
        return
      }
      if (Date.now() - start >= maxMs) {
        reject(new Error(`Timed out waiting for MongoDB on port ${port}`))
        return
      }
      setTimeout(check, 400)
    }
    check()
  })
}

async function repairDatabase(dbPath) {
  const binary = await MongoBinary.getPath()
  return new Promise((resolve) => {
    const repair = spawn(binary, ['--repair', '--dbpath', dbPath], {
      stdio: 'ignore',
      windowsHide: true,
    })
    repair.on('exit', () => resolve())
  })
}

async function clearStaleLock(dbPath) {
  const lockPath = path.join(dbPath, 'mongod.lock')
  if (!fs.existsSync(lockPath)) return

  try {
    fs.unlinkSync(lockPath)
  } catch (err) {
    if (err.code === 'EBUSY' || err.code === 'EPERM') {
      console.warn('Database lock detected — running repair...')
      await repairDatabase(dbPath)
      try {
        fs.unlinkSync(lockPath)
      } catch {
        // mongod --repair may have cleared it
      }
    }
  }
}

/**
 * Start a real mongod process backed by files on disk, or reuse one already
 * listening on LOCAL_DB_PORT. The process is detached so data survives app restarts.
 */
export async function ensureLocalMongod(databaseName = 'ai-guidance-counselor') {
  const uri = getLocalDbUri(databaseName)

  if (await isPortOpen(LOCAL_DB_PORT)) {
    console.log(`Reusing local MongoDB on port ${LOCAL_DB_PORT} (${databaseName})`)
    return uri
  }

  fs.mkdirSync(LOCAL_DB_PATH, { recursive: true })
  await clearStaleLock(LOCAL_DB_PATH)

  const binary = await MongoBinary.getPath()
  const args = [
    '--dbpath', LOCAL_DB_PATH,
    '--port', String(LOCAL_DB_PORT),
    '--bind_ip', '127.0.0.1',
    '--quiet',
  ]

  const proc = spawn(binary, args, {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  })
  proc.unref()

  await waitForPort(LOCAL_DB_PORT)
  console.log(`Local MongoDB started on port ${LOCAL_DB_PORT} (${LOCAL_DB_PATH}, db: ${databaseName})`)
  return uri
}
