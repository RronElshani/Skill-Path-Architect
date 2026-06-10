import { ensureLocalMongod, LOCAL_DB_URI, LOCAL_DB_PATH } from '../src/config/localMongo.js'

await ensureLocalMongod()
console.log(`Local MongoDB ready`)
console.log(`  URI:  ${LOCAL_DB_URI}`)
console.log(`  Path: ${LOCAL_DB_PATH}`)
console.log('Leave this running, or it will auto-start when you run npm run dev.')
