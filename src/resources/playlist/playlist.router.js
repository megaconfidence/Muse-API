import { Router } from 'express'
import controllers from './playlist.controllers'

const router = Router()

// /api/playlist
router
.route('/')
.get(controllers.getMany)
.post(controllers.createOne)

// /api/playlist/:id
router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router
