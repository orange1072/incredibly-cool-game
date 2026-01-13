export const createCookieString = (
  cookieNames: string[],
  cookiesObj: { [key: string]: string }
) => {
  return cookieNames
    .map(cookieName => `${cookieName}=${cookiesObj[cookieName]}`)
    .join('; ')
}
