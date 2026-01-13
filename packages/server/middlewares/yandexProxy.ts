import { Request } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { ServerResponse } from 'http'
import { YANDEX_API } from './constants'

export const yandexProxy = createProxyMiddleware({
  target: YANDEX_API,
  changeOrigin: true,
  cookieDomainRewrite: {
    '*': '',
  },
  pathRewrite: {
    '^/ya-api': '',
  },
  on: {
    proxyReq: (proxyReq, req: Request) => {
      const targetUrl = `${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`
      console.log('Full Target URL:', targetUrl)
      console.log('Request Method:', req.method)
      if (req.method === 'POST' && req.body) {
        console.log('Request body:', req.body)
      }
    },
    proxyRes: proxyRes => {
      console.log('Response status: ', proxyRes.statusCode)
    },
    error: (err, _, res) => {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.log('ERROR: ', errorMessage)
      if (res instanceof ServerResponse) {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        })
      }
      res.end(
        'Something went wrong. And we are reporting a custom error message.'
      )
    },
  },
})
