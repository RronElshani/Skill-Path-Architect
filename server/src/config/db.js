import mongoose from 'mongoose'
import config from './index.js'
import { bootstrapAdmin } from '../services/bootstrapAdmin.js'
import { ensureLocalMongod, LOCAL_DB_PATH } from './localMongo.js'

/** @type {'remote' | 'local-file'} */
export let dbStorageMode = 'remote'

export let usingInMemoryDb = false

async function connectRemote() {
  const conn = await mongoose.connect(config.mongodbUri, {
    serverSelectionTimeoutMS: 4000,
  })
  dbStorageMode = 'remote'
  usingInMemoryDb = false
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
  await bootstrapAdmin()
}

async function connectLocal() {
  const uri = await ensureLocalMongod(config.mongodbDatabase)
  const conn = await mongoose.connect(uri)
  dbStorageMode = 'local-file'
  usingInMemoryDb = false
  console.log(`MongoDB connected (persistent): ${LOCAL_DB_PATH}/${config.mongodbDatabase}`)
  await bootstrapAdmin()
  return conn
}

const connectDB = async () => {
  const isDev = config.nodeEnv === 'development'

  // Dev: prefer the file-backed DB in server/data/db so accounts survive restarts
  if (isDev && config.preferLocalMongo) {
    try {
      return await connectLocal()
    } catch (error) {
      console.warn(`Local MongoDB unavailable (${error.message}). Trying MONGODB_URI...`)
    }
  }

  try {
    await connectRemote()
    return
  } catch (error) {
    if (!isDev) {
      console.error(`MongoDB connection error: ${error.message}`)
      process.exit(1)
    }
    console.warn(`Could not connect to ${config.mongodbUri}: ${error.message}`)
  }

  // Dev fallback when remote (Docker) is not running
  try {
    return await connectLocal()
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
