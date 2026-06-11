import fs from 'fs'
import net from 'net'
import path from 'path'
import { fileURLToPath } from 'url'
import { MongoMemoryServer } from 'mongodb-memory-server'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const LOCAL_DB_PATH = path.join(__dirname, '../../data/db')
export const LOCAL_DB_PORT = 27018

/** @type {MongoMemoryServer | null} */
let localServer = null
let ephemeral = false

export function getLocalDbUri(databaseName = 'ai-guidance-counselor') {
  if (localServer) {
    const base = localServer.getUri()
    const normalized = base.endsWith('/') ? base.slice(0, -1) : base
    return `${normalized}/${databaseName}`
  }
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

function clearStaleLock(dbPath) {
  const lockPath = path.join(dbPath, 'mongod.lock')
  if (!fs.existsSync(lockPath)) return

  try {
    fs.unlinkSync(lockPath)
    console.log('Removed stale mongod.lock')
  } catch {
    // Another process may hold the lock
  }
}

function archiveCorruptDb(dbPath) {
  const archivePath = `${dbPath}-archive-${Date.now()}`
  try {
    if (fs.existsSync(dbPath)) {
      fs.renameSync(dbPath, archivePath)
      console.log(`Archived corrupt database to ${path.basename(archivePath)}`)
    }
  } catch (err) {
    console.warn(`Could not archive database: ${err.message}`)
  }
}

async function startPersistentServer() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.mkdirSync(LOCAL_DB_PATH, { recursive: true })
  }
  clearStaleLock(LOCAL_DB_PATH)

  try {
    localServer = await MongoMemoryServer.create({
      instance: {
        dbPath: LOCAL_DB_PATH,
        port: LOCAL_DB_PORT,
        storageEngine: 'wiredTiger',
      },
    })
    return localServer
  } catch (error) {
    const msg = error?.message || ''
    if (msg.includes('exit') || msg.includes('62') || msg.includes('dbPath')) {
      localServer = null
      archiveCorruptDb(LOCAL_DB_PATH)
      fs.mkdirSync(LOCAL_DB_PATH, { recursive: true })
      localServer = await MongoMemoryServer.create({
        instance: {
          dbPath: LOCAL_DB_PATH,
          port: LOCAL_DB_PORT,
          storageEngine: 'wiredTiger',
        },
      })
      return localServer
    }
    throw error
  }
}

async function startEphemeralServer() {
  localServer = await MongoMemoryServer.create()
  return localServer
}

export async function ensureLocalMongo(databaseName = 'ai-guidance-counselor') {
  if (localServer) {
    return getLocalDbUri(databaseName)
  }

  const portInUse = await isPortOpen(LOCAL_DB_PORT)
  if (portInUse) {
    console.log(`Using existing MongoDB on port ${LOCAL_DB_PORT}`)
    return getLocalDbUri(databaseName)
  }

  console.log('Starting local MongoDB...')
  ephemeral = false
  try {
    await startPersistentServer()
    console.log(`Local MongoDB ready (persistent: ${LOCAL_DB_PATH})`)
  } catch (error) {
    console.warn(`Persistent MongoDB failed (${error.message}). Falling back to in-memory.`)
    localServer = null
    await startEphemeralServer()
    ephemeral = true
    console.log('Local MongoDB ready (in-memory — accounts reset on restart)')
  }

  return getLocalDbUri(databaseName)
}

export function isEphemeralLocalServer() {
  return ephemeral
}
