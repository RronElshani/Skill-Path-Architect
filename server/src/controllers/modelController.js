import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import modelExperimentService from '../services/modelExperimentService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// server/src/controllers/ -> project root is three levels up
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..')

const modelController = {
  async getAllExperiments(req, res, next) {
    try {
      const experiments = await modelExperimentService.getAllExperiments()
      res.status(200).json({
        success: true,
        data: experiments
      })
    } catch (error) {
      next(error)
    }
  },

  async promoteModel(req, res, next) {
    try {
      const promoted = await modelExperimentService.promoteModel(req.params.id)
      res.status(200).json({
        success: true,
        message: 'Model promoted and reloaded successfully',
        data: promoted
      })
    } catch (error) {
      next(error)
    }
  },

  async trainModel(req, res, next) {
    // Set headers for Server-Sent Events (SSE)
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })

    try {
      const {
        algorithm = 'XGBoost',
        learningRate,
        maxDepth,
        nEstimators,
        cValue,
        hiddenLayerSizes,
        epochs
      } = req.query // We will accept parameters via query for SSE simplicity

      // Generate unique Run ID
      const runId = 'run_' + algorithm.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now()
      
      // Setup command arguments relative to project root
      const args = [
        'ai/train.py',
        '-i', 'ai/dataset/dataset_skill_predictor.csv',
        '-m', `ai/models/archive/model_${runId}.h5`,
        '--algorithm', algorithm,
        '--run_id', runId
      ]

      if (learningRate) args.push('--learning_rate', learningRate)
      if (maxDepth) args.push('--max_depth', maxDepth)
      if (nEstimators) args.push('--n_estimators', nEstimators)
      if (cValue) args.push('--c_value', cValue)
      if (hiddenLayerSizes) args.push('--hidden_layer_sizes', hiddenLayerSizes)
      if (epochs) args.push('--epochs', epochs)

      // Log spawn attempt to client
      res.write(`data: ${JSON.stringify({ type: 'log', message: `Launching training job. Run ID: ${runId}\n` })}\n\n`)
      res.write(`data: ${JSON.stringify({ type: 'log', message: `Project root: ${PROJECT_ROOT}\n` })}\n\n`)
      res.write(`data: ${JSON.stringify({ type: 'log', message: `Executing command: python ${args.join(' ')}\n\n` })}\n\n`)

      const pythonProcess = spawn('python', args, { cwd: PROJECT_ROOT })

      let stdoutBuffer = ''

      pythonProcess.stdout.on('data', (data) => {
        const text = data.toString()
        stdoutBuffer += text
        res.write(`data: ${JSON.stringify({ type: 'log', message: text })}\n\n`)
      })

      pythonProcess.stderr.on('data', (data) => {
        const text = data.toString()
        res.write(`data: ${JSON.stringify({ type: 'log', message: text })}\n\n`)
      })

      pythonProcess.on('error', (err) => {
        console.error('Failed to spawn Python process:', err)
        res.write(`data: ${JSON.stringify({
          type: 'error',
          message: `Failed to start Python training process: ${err.message}. Please verify Python is installed and configured in your server path.`
        })}\n\n`)
        res.end()
      })

      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
          res.write(`data: ${JSON.stringify({ type: 'error', message: `Python execution failed with exit code: ${code}` })}\n\n`)
          res.end()
          return
        }

        try {
          // Find the __METRICS_JSON__: line in the stdoutBuffer
          const marker = '__METRICS_JSON__:'
          const markerIndex = stdoutBuffer.indexOf(marker)
          if (markerIndex === -1) {
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'Could not find training metrics in process output.' })}\n\n`)
            res.end()
            return
          }

          // Extract metrics string (take from marker start until the end of that line)
          const metricsStr = stdoutBuffer.substring(markerIndex + marker.length).split('\n')[0].trim()
          const metricsData = JSON.parse(metricsStr)

          // Construct model experiment object
          const experimentPayload = {
            runId,
            algorithm: metricsData.algorithm,
            hyperparameters: metricsData.hyperparameters || {},
            accuracy: metricsData.accuracy,
            precision: metricsData.precision,
            recall: metricsData.recall,
            f1Score: metricsData.f1Score,
            metricsPerClass: metricsData.metricsPerClass || {},
            filePath: metricsData.filePath || `ai/models/archive/model_${runId}.h5`,
            encoderPath: metricsData.encoderPath || `ai/models/archive/encoder_${runId}.h5`,
            isActive: false
          }

          const savedExperiment = await modelExperimentService.createExperiment(experimentPayload)

          res.write(`data: ${JSON.stringify({ type: 'success', data: savedExperiment })}\n\n`)
        } catch (err) {
          res.write(`data: ${JSON.stringify({ type: 'error', message: `Failed to save experiment metrics: ${err.message}` })}\n\n`)
        } finally {
          res.end()
        }
      })

      // If client disconnects, kill process
      req.on('close', () => {
        if (pythonProcess && pythonProcess.exitCode === null) {
          console.log(`SSE client disconnected. Killing training process ${pythonProcess.pid}`)
          pythonProcess.kill()
        }
      })

    } catch (error) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: `Internal server error: ${error.message}` })}\n\n`)
      res.end()
    }
  }
}

export default modelController
