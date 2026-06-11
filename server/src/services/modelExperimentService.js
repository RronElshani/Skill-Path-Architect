
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import modelExperimentRepository from '../repositories/modelExperimentRepository.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// server/src/services/ -> project root is three levels up
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..')

const modelExperimentService = {
  async getAllExperiments() {
    return await modelExperimentRepository.findAll()
  },

  async createExperiment(data) {
    return await modelExperimentRepository.create(data)
  },

  async promoteModel(id) {
    const experiment = await modelExperimentRepository.findById(id)
    if (!experiment) {
      const error = new Error('Model experiment not found')
      error.statusCode = 404
      throw error
    }

    // Resolve paths relative to ai/ directory
    const aiDir = path.resolve(PROJECT_ROOT, 'ai')

    // Determine source files
    // The filePath and encoderPath stored are relative to ai/ (e.g. ai/models/archive/...)
    // Or they might be stored relative to the project root. Let's handle both dynamically:
    let sourceModel = experiment.filePath
    if (sourceModel.startsWith('ai/')) {
      sourceModel = sourceModel.substring(3) // remove 'ai/' prefix
    }
    const sourceModelPath = path.resolve(aiDir, sourceModel)

    let sourceEncoder = experiment.encoderPath || ''
    if (sourceEncoder.startsWith('ai/')) {
      sourceEncoder = sourceEncoder.substring(3)
    }
    const sourceEncoderPath = sourceEncoder ? path.resolve(aiDir, sourceEncoder) : ''

    // Determine target files (the active production ones)
    const targetModelPath = path.resolve(aiDir, 'models/career_prediction_model.h5')
    const targetEncoderPath = path.resolve(aiDir, 'models/career_label_encoder.h5')

    // Perform copy
    if (!fs.existsSync(sourceModelPath)) {
      const error = new Error(`Source model file not found at: ${sourceModelPath}`)
      error.statusCode = 500
      throw error
    }

    fs.copyFileSync(sourceModelPath, targetModelPath)

    if (sourceEncoderPath && fs.existsSync(sourceEncoderPath)) {
      fs.copyFileSync(sourceEncoderPath, targetEncoderPath)
    } else {
      console.warn(`Warning: Label encoder file not found at ${sourceEncoderPath}, skipping copy.`)
    }

    // Update active flag in DB
    const updated = await modelExperimentRepository.setActive(id)

    // Trigger Flask reload
    try {
      const response = await fetch('http://localhost:5001/api/reload_model', {
        method: 'POST'
      })
      if (!response.ok) {
        console.error('Flask model reload API responded with status:', response.status)
      } else {
        console.log('Successfully requested AI service reload.')
      }
    } catch (err) {
      console.warn(`Warning: Failed to trigger AI service reload: ${err.message}. (Prediction service might need restart or is not running)`)
    }

    return updated
  },

  async seedInitialExperimentIfEmpty() {
    // Make sure random forest model is unzipped
    const aiDir = path.resolve(PROJECT_ROOT, 'ai')
    const rfH5 = path.resolve(aiDir, 'models/random_forest/career_prediction_model.h5')
    const rfZip = path.resolve(aiDir, 'models/random_forest/career_prediction_model.zip')
    if (fs.existsSync(rfZip) && !fs.existsSync(rfH5)) {
      console.log('Unzipping Random Forest model weights on startup...')
      try {
        execSync(`python -c "import zipfile; zip_ref = zipfile.ZipFile(r'${rfZip}', 'r'); zip_ref.extractall(r'${path.dirname(rfH5)}'); zip_ref.close()"`)
        console.log('Random Forest model weights unzipped successfully.')
      } catch (err) {
        console.error('Failed to unzip Random Forest model weights:', err.message)
      }
    }

    const initialSeeds = [
      {
        runId: 'run_initial_xgboost',
        algorithm: 'XGBoost',
        hyperparameters: {
          maxDepth: 5,
          learningRate: 0.1,
          nEstimators: 500
        },
        accuracy: 0.8292,
        precision: 0.8372,
        recall: 0.8292,
        f1Score: 0.8286,
        filePath: 'ai/models/xgboost/career_prediction_model.h5',
        encoderPath: 'ai/models/xgboost/career_label_encoder.h5',
        isActive: true,
        metricsPerClass: {}
      },
      {
        runId: 'run_initial_random_forest',
        algorithm: 'Random Forest',
        hyperparameters: {
          maxDepth: 10,
          nEstimators: 100
        },
        accuracy: 0.8528,
        precision: 0.8513,
        recall: 0.8528,
        f1Score: 0.8480,
        filePath: 'ai/models/random_forest/career_prediction_model.h5',
        encoderPath: 'ai/models/random_forest/career_label_encoder.h5',
        isActive: false,
        metricsPerClass: {}
      },
      {
        runId: 'run_initial_svm',
        algorithm: 'SVM',
        hyperparameters: {
          cValue: 10.0
        },
        accuracy: 0.8653,
        precision: 0.8688,
        recall: 0.8653,
        f1Score: 0.8631,
        filePath: 'ai/models/svm/career_prediction_model.h5',
        encoderPath: 'ai/models/svm/career_label_encoder.h5',
        isActive: false,
        metricsPerClass: {}
      },
      {
        runId: 'run_initial_neural_network',
        algorithm: 'Neural Network',
        hyperparameters: {
          learningRate: 0.001,
          epochs: 200,
          hiddenLayerSizes: [100, 50]
        },
        accuracy: 0.8486,
        precision: 0.8581,
        recall: 0.8486,
        f1Score: 0.8476,
        filePath: 'ai/models/neural_network/career_prediction_model.h5',
        encoderPath: 'ai/models/neural_network/career_label_encoder.h5',
        isActive: false,
        metricsPerClass: {}
      }
    ]

    console.log('Synchronizing initial model experiments with updated scores in database...')
    const active = await modelExperimentRepository.findActive()

    for (const seed of initialSeeds) {
      let isActiveFlag = seed.isActive
      if (active) {
        isActiveFlag = (active.runId === seed.runId)
      }

      await modelExperimentRepository.upsertByRunId(seed.runId, {
        algorithm: seed.algorithm,
        hyperparameters: seed.hyperparameters,
        accuracy: seed.accuracy,
        precision: seed.precision,
        recall: seed.recall,
        f1Score: seed.f1Score,
        filePath: seed.filePath,
        encoderPath: seed.encoderPath,
        isActive: isActiveFlag,
        metricsPerClass: seed.metricsPerClass
      })
    }
    console.log('Initial model experiments synchronized successfully.')
  }
}

export default modelExperimentService
