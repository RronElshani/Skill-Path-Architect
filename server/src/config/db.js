import mongoose from 'mongoose'
import config from './index.js'
import { bootstrapAdmin } from '../services/bootstrapAdmin.js'

export const dbStorageMode = 'remote'
export const usingInMemoryDb = false

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 4000,
    })
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
    await bootstrapAdmin()
    return conn
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    console.error(`Please make sure your MongoDB service is running on port 27017 (or check your MONGODB_URI in .env).`)
    process.exit(1)
  }
}

export default connectDB
