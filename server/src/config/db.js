import mongoose from 'mongoose'
import config from './index.js'
import { bootstrapAdmin } from '../services/bootstrapAdmin.js'
import { ensureLocalMongod, LOCAL_DB_PATH } from './localMongo.js'

/** @type {'remote' | 'local-file'} */
export let dbStorageMode = 'remote'

export let usingInMemoryDb = false

const connectDB = async () => {
  // 1) Prefer Docker / installed MongoDB on MONGODB_URI (default :27017)
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 4000,
    })
    dbStorageMode = 'remote'
    usingInMemoryDb = false
    console.log(`MongoDB connected: ${conn.connection.host}`)
    await bootstrapAdmin()
    return
  } catch (error) {
    if (config.nodeEnv !== 'development') {
      console.error(`MongoDB connection error: ${error.message}`)
      process.exit(1)
    }

    console.warn(`Could not connect to ${config.mongodbUri}: ${error.message}`)
  }

  // 2) Dev fallback — file-backed mongod on a fixed port (data persists across restarts)
  try {
    const uri = await ensureLocalMongod()
    const conn = await mongoose.connect(uri)
    dbStorageMode = 'local-file'
    usingInMemoryDb = false
    console.log(`MongoDB connected (persistent): ${LOCAL_DB_PATH}`)
    await bootstrapAdmin()
    return conn
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
