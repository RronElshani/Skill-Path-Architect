import mongoose from 'mongoose'
import config from './index.js'
import { bootstrapAdmin } from '../services/bootstrapAdmin.js'
import { ensureLocalMongo, isEphemeralLocalServer } from './localMongo.js'

/** @type {'remote' | 'local-file' | 'local-ephemeral'} */
export let dbStorageMode = 'remote'
export let usingInMemoryDb = false

async function connectTo(uri, mode) {
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  })
  dbStorageMode = mode
  usingInMemoryDb = isEphemeralLocalServer()
  console.log(
    `MongoDB connected: ${conn.connection.host}/${conn.connection.name} (${mode}${usingInMemoryDb ? ', ephemeral' : ''})`
  )
  await bootstrapAdmin()
  return conn
}

const connectDB = async () => {
  if (config.nodeEnv === 'development' && config.preferLocalMongo) {
    try {
      const uri = await ensureLocalMongo(config.mongodbDatabase)
      const mode = isEphemeralLocalServer() ? 'local-ephemeral' : 'local-file'
      return await connectTo(uri, mode)
    } catch (localError) {
      console.warn(`Local MongoDB startup failed: ${localError.message}`)
    }
  }

  try {
    return await connectTo(config.mongodbUri, 'remote')
  } catch (error) {
    if (config.nodeEnv !== 'development') {
      console.error(`MongoDB connection error: ${error.message}`)
      process.exit(1)
    }

    console.warn(`Could not connect to ${config.mongodbUri}: ${error.message}`)
    try {
      const uri = await ensureLocalMongo(config.mongodbDatabase)
      const mode = isEphemeralLocalServer() ? 'local-ephemeral' : 'local-file'
      return await connectTo(uri, mode)
    } catch (fallbackError) {
      console.error(`MongoDB connection error: ${fallbackError.message}`)
      process.exit(1)
    }
  }
}

export default connectDB
