import ModelExperiment from '../models/ModelExperiment.js'

const modelExperimentRepository = {
  async create(data) {
    const experiment = new ModelExperiment(data)
    return await experiment.save()
  },

  async findAll() {
    return await ModelExperiment.find().sort({ createdAt: -1 })
  },

  async findById(id) {
    return await ModelExperiment.findById(id)
  },

  async findActive() {
    return await ModelExperiment.findOne({ isActive: true })
  },

  async deactivateAll() {
    return await ModelExperiment.updateMany({}, { isActive: false })
  },

  async deleteAll() {
    return await ModelExperiment.deleteMany({})
  },

  async setActive(id) {
    await ModelExperiment.updateMany({ _id: { $ne: id } }, { isActive: false })
    return await ModelExperiment.findByIdAndUpdate(id, { isActive: true }, { new: true })
  },

  async upsertByRunId(runId, data) {
    return await ModelExperiment.findOneAndUpdate({ runId }, { $set: data }, { upsert: true, new: true })
  }
}

export default modelExperimentRepository
