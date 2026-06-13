import careerService from '../services/careerService.js'

/**
 * Controller layer — handles HTTP requests/responses for the career library.
 * No business logic here; everything delegates to careerService.
 */
const careerController = {
  async list(req, res, next) {
    try {
      const careers = await careerService.listCareers({
        search: req.query.search,
        intelligence: req.query.intelligence,
      })
      res.status(200).json({
        success: true,
        count: careers.length,
        data: careers,
      })
    } catch (error) {
      next(error)
    }
  },

  async getByCode(req, res, next) {
    try {
      const career = await careerService.getCareerByCode(req.params.code)
      res.status(200).json({
        success: true,
        data: career,
      })
    } catch (error) {
      next(error)
    }
  },
}

export default careerController
