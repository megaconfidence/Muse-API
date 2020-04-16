import { Router } from 'express'
import controllers from './like.controllers'

const router = Router()

// /api/like
router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.createOne)

// /api/like/:id
router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router
