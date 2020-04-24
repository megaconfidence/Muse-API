import { Router } from 'express'
import controllers from './queue.controllers'

const router = Router()

// /api/queue
router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.createOne)

// /api/queue/:id
router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router
