import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

import config from './config'
import { connect } from './utils/db'
import userRouter from './resources/user/user.router'
import playListRouter from './resources/playlist/playlist.router'
import queueRouter from './resources/queue/queue.router'
import { signin, protect } from './utils/auth'
import passport from 'passport'
import mongoSanitize from 'express-mongo-sanitize'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(morgan('dev'))
app.use(mongoSanitize());
app.use(passport.initialize())
app.use(urlencoded({ extended: true }))


// Test if server is running
app.get('/', (req, res) => {
  res.json({ ok: true })
})
app.use('/signin', signin)
app.use('/api', protect)
app.use('/api/user', userRouter)
app.use('/api/playlist', playListRouter)
app.use('/api/queue', queueRouter)

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}
