import { Request, Response, NextFunction } from 'express'

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookiesInReq = req.cookies
  console.log('in middleware cookies: ', cookiesInReq)
  if (!cookiesInReq) {
    return res.sendStatus(401)
  }
  return next()
}
