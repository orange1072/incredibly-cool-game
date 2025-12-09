import { Router } from 'express'
import { checkAuth } from '../middlewares/authorization'

const router = Router()

router.use(checkAuth)

router.get('/welcome', (_, res) => {
  const user = res.locals.user
  if (user) {
    res.send(`Welcome, ${user.first_name} ${user.second_name}!`)
  } else {
    res.send(`Welcome, anonymous!`)
  }
})

export default router
