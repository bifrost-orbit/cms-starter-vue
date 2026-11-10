# CMS Orbit starter for Vue

A Vue website, built with Vite and Vue Router, that reads its pages from [CMS Orbit](https://bifrostorbit.com/products/cms-orbit/), the headless CMS in Bifröst Orbit. It is the finished project from the [Vue quickstart](https://docs.bifrostorbit.com/cms/developers/quickstart-vue/): every published page at its own address, your own Vue components for the blocks editors place, drafts in the live preview, and a small server that holds the secret key and checks the signed webhook.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/bifrost-orbit/cms-starter-vue?quickstart=1)

## Set up

1. **Create your copy.** Select **Use this template** on GitHub, or run `gh repo create my-website --template bifrost-orbit/cms-starter-vue --private --clone`.
2. **Add your settings.** Copy `.env.example` to `.env` and fill in the API address, keys and region from **Configuration › API keys** and **Configuration › Environments** in CMS Orbit. Only the `VITE_` settings reach the browser, so only the public key has that prefix.
3. **Run it.** Run `npm install`, then `npm run server` in one terminal and `npm run dev` in another, and open `http://localhost:5173`.

## What's inside

| File | What it does |
| --- | --- |
| `src/cms/client.ts` | The CMS Orbit client, with the public key, and the draft request |
| `src/views/CmsPageView.vue` | One view for every page: redirects, not found, title and description |
| `src/components/CmsBlock.vue`, `src/cms/registry.ts` | Which Vue component draws which CMS component |
| `src/cms/blocks/` | The components: `hero`, `featureSpotlight` and `action` |
| `server/preview.ts` | Reads drafts with the secret key, and answers the signed webhook at `/api/cms-webhook` |

## Make it yours

- Run `npm run cms:types` to write your space's components to `src/cms/types.ts`.
- Draw your components in `src/cms/blocks/` and register them in `src/cms/registry.ts`, using the component keys from your own space.
- For the live preview, set **Preview URL** in the space's **Settings**.
- To deploy, serve `dist` from `npm run build` as static files that fall back to `index.html`, and run `server/preview.ts` on the same domain under `/api/`. `npm run server` reads `.env` only if it exists, so on a host you can set the same settings as environment variables instead. The [quickstart](https://docs.bifrostorbit.com/cms/developers/quickstart-vue/) explains preview, deploying and the webhook.

Needs Node.js 22.18 or later, or 24.12 or later, and `@bifrost-orbit-cms/sdk` 0.12.

## Licence

MIT. See [LICENSE](LICENSE).
