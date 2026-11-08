<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CmsPage } from '@bifrost-orbit-cms/sdk'
import CmsBlock from '@/components/CmsBlock.vue'
import { loadPage } from '@/cms/client'

const route = useRoute()
const router = useRouter()
const page = ref<CmsPage | null>(null)
const missing = ref(false)

function setMeta(title: string, description = '') {
  document.title = title
  let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!tag) {
    tag = document.createElement('meta')
    tag.name = 'description'
    document.head.append(tag)
  }
  tag.content = description
}

function addBridge(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return
  const script = document.createElement('script')
  script.src = src
  script.defer = true
  document.head.append(script)
}

async function load(path: string) {
  const token = typeof route.query.preview === 'string' ? route.query.preview : null
  const { result, bridge } = await loadPage(path, token)
  if (result.kind === 'redirect') {
    if (result.to.startsWith('/')) router.replace(result.to)
    else window.location.replace(result.to)
    return
  }
  if (result.kind !== 'page') {
    page.value = null
    missing.value = true
    setMeta('Page not found')
    return
  }
  missing.value = false
  page.value = result.page
  document.documentElement.lang = result.page.locale
  setMeta(result.page.seo.title, result.page.seo.description)
  if (bridge) addBridge(bridge)
}

function refreshWhenVisible() {
  if (document.visibilityState === 'visible') load(route.path)
}

watch(() => route.path, load, { immediate: true })
onMounted(() => document.addEventListener('visibilitychange', refreshWhenVisible))
onBeforeUnmount(() => document.removeEventListener('visibilitychange', refreshWhenVisible))
</script>

<template>
  <main v-if="page">
    <CmsBlock v-for="block in page.components" :key="block.id" :block="block" />
  </main>
  <main v-else-if="missing">
    <h1>We couldn't find that page</h1>
    <p><RouterLink to="/">Back to the home page</RouterLink></p>
  </main>
</template>
