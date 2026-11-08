import { createCmsClient, type CmsResolution } from '@bifrost-orbit-cms/sdk'

export const cms = createCmsClient({
  baseUrl: import.meta.env.VITE_CMS_API_URL,
  apiKey: import.meta.env.VITE_CMS_PUBLIC_KEY,
  defaultRegion: import.meta.env.VITE_CMS_DEFAULT_REGION,
})

export type LoadedPage = { result: CmsResolution; bridge: string | null }

export async function loadPage(path: string, token: string | null): Promise<LoadedPage> {
  if (token) {
    const response = await fetch(`/api/preview-page?path=${encodeURIComponent(path)}&token=${encodeURIComponent(token)}`)
    if (response.ok) return response.json()
  }
  return { result: await cms.resolve({ path }), bridge: null }
}
