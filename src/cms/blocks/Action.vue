<script setup lang="ts">
import type { CmsNode } from '@bifrost-orbit-cms/sdk'
import type { ActionBlock } from '@/cms/types'

defineProps<{ block: CmsNode<ActionBlock> }>()
</script>

<template>
  <RouterLink
    v-if="block.fields.link?.href?.startsWith('/')"
    :data-cms-id="block.id"
    :class="['button', block.fields.style ?? 'primary']"
    :to="block.fields.link.href"
  >
    {{ block.fields.label }}
  </RouterLink>
  <a
    v-else-if="block.fields.link?.href"
    :data-cms-id="block.id"
    :class="['button', block.fields.style ?? 'primary']"
    :href="block.fields.link.href"
    :target="block.fields.link.target ?? undefined"
  >
    {{ block.fields.label }}
  </a>
  <span v-else :data-cms-id="block.id" :class="['button', block.fields.style ?? 'primary']">{{ block.fields.label }}</span>
</template>
