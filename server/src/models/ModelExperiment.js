import mongoose from 'mongoose'

const modelExperimentSchema = new mongoose.Schema(
  {
    runId: {
      type: String,
      required: true,
      unique: true,
    },
    algorithm: {
      type: String,
      required: true,
    },
    hyperparameters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    accuracy: {
      type: Number,
      required: true,
    },
    precision: {
      type: Number,
      required: true,
    },
    recall: {
      type: Number,
      required: true,
    },
    f1Score: {
      type: Number,
      required: true,
    },
    metricsPerClass: {
      type: Map,
      of: {
        precision: Number,
        recall: Number,
        f1: Number,
      },
      default: {},
    },
    filePath: {
      type: String,
      required: true,
    },
    encoderPath: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const ModelExperiment = mongoose.model('ModelExperiment', modelExperimentSchema, 'model_experiments')

export default ModelExperiment
