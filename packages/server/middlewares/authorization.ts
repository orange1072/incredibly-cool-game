import { Request, Response, NextFunction } from 'express'

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies
  const requiredCookies = ['authCookie', 'uuid']
  if (requiredCookies.every(cookie => cookies[cookie])) {
    const yaAPI = 'https://ya-praktikum.tech/api/v2'

    const cookiesFormed = requiredCookies
      .map(cookieName => `${cookieName}=${cookies[cookieName]}`)
      .join('; ')

    try {
      const response = await fetch(`${yaAPI}/auth/user`, {
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
