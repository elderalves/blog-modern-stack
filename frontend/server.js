import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import dotenv from 'dotenv'
import { generateSitemap } from './generateSitemap.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createProdServer() {
  const app = express()

  app.use((await import('compression')).default())
  app.use(
    (await import('serve-static')).default(
      path.resolve(__dirname, 'dist/client'),
      { index: false },
    ),
  )

  // Handle all other routes with the index.html file
  app.use('*', async (req, res, next) => {
    if (req.originalUrl === '/sitemap.xml') {
      const sitemap = await generateSitemap()
      return res
        .status(200)
        .set({ 'Content-Type': 'application/xml' })
        .end(sitemap)
    }

    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, 'dist/client/index.html'),
        'utf-8',
      )
      const render = (await import('../dist/server/entry-server.js')).render

      const appHTML = await render(req)
      const html = template.replace('<!--ssr-outlet-->', appHTML)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      next(e)
    }
  })

  return app
}

async function createDevServer() {
  const app = express()

  const vite = await (
    await import('vite')
  ).createServer({
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  })

  // Ensure vite and its middlewares are properly initialized
  if (!vite || !vite.middlewares) {
    throw new Error('Vite server or middlewares not properly initialized')
  }

  app.use(vite.middlewares)

  app.use('*', async (req, res, next) => {
    if (req.originalUrl === '/sitemap.xml') {
      const sitemap = await generateSitemap()
      return res
        .status(200)
        .set({ 'Content-Type': 'application/xml' })
        .end(sitemap)
    }

    try {
      const templateHtml = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8',
      )
      const template = await vite.transformIndexHtml(
        req.originalUrl,
        templateHtml,
      )
      const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')
      const appHtml = await render(req)
      const html = template.replace('<!--ssr-outlet-->', appHtml)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  return app
}

if (process.env.NODE_ENV === 'production') {
  const app = await createProdServer()

  app.listen(process.env.PORT, () =>
    console.log(
      `ssr prod server running at http://localhost:${process.env.PORT}`,
    ),
  )
} else {
  const app = await createDevServer()

  app.listen(process.env.PORT, () =>
    console.log(
      `ssr dev server running at http://localhost:${process.env.PORT}`,
    ),
  )
}
