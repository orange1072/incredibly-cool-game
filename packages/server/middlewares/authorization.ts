import { Request, Response, NextFunction } from 'express'
import { requiredCookies, YANDEX_API } from './constants'
import { createCookieString } from './utils/createCookies'

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies
  if (requiredCookies.every(cookie => cookies[cookie])) {
    const cookiesFormed = createCookieString(requiredCookies, cookies)

    try {
      const response = await fetch(`${YANDEX_API}/auth/user`, {
        method: 'GET',
        headers: {
          Cookie: cookiesFormed,
        },
      })
      if (!response.ok) {
        return res.status(response.status).json({ error: response.statusText })
      } else {
        const user = await response.json()
        res.locals.user = user
        return next()
      }
    } catch (err) {
      console.error('fetch failed: ', err)
      return res
        .status(500)
        .json({ error: 'Authorization check is not available' })
    }
  } else {
    return res.sendStatus(401)
  }
}
