import { createServer, type IncomingMessage } from 'node:http'
import { createCmsClient, verifyWebhook } from '@bifrost-orbit-cms/sdk'

const cms = createCmsClient({
  baseUrl: process.env.VITE_CMS_API_URL!,
  apiKey: process.env.VITE_CMS_PUBLIC_KEY!,
  previewKey: process.env.CMS_PREVIEW_KEY!,
  defaultRegion: process.env.VITE_CMS_DEFAULT_REGION,
})

async function readBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of request) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost')

  if (request.method === 'GET' && url.pathname === '/api/preview-page') {
    if (!(await cms.checkPreview(url.searchParams.get('token'))).valid) {
      response.writeHead(401).end()
      return
    }
    const path = url.searchParams.get('path') ?? '/'
    const result = await cms.resolve({ path: path.startsWith('/') ? path : '/', preview: true })
    response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
    response.end(JSON.stringify({ result, bridge: `${cms.origin}/bridge.js` }))
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/cms-webhook') {
    const secret = process.env.CMS_WEBHOOK_SECRET
    const result = secret
      ? await verifyWebhook({
          body: await readBody(request),
          timestamp: request.headers['x-orbit-timestamp']?.toString(),
          signature: request.headers['x-orbit-signature']?.toString(),
          secret,
        })
      : null
    if (!result?.valid) {
      response.writeHead(401).end()
      return
    }
    console.log('CMS Orbit:', result.event, result.data.url ?? '')
    response.writeHead(204).end()
    return
  }

  response.writeHead(404).end()
}).listen(Number(process.env.PORT ?? 3030))
