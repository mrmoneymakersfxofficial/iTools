---
Task ID: 1
Agent: Main Agent
Task: Implement Section Deep Linking, Progress Bar, Premium Scrollbar, Particle Trail, SEO Sitemap

Work Log:
- Created `useSectionDeepLinking` hook with IntersectionObserver + History API for all pages
- Created `ReadingProgressBar` component (fixed top gradient bar, hidden on homepage)
- Created `ParticleTrail` canvas component (glowing blue particles on mouse move, pointer-events: none)
- Updated `globals.css` with premium gradient scrollbar (blue glow), progress bar styles, particle canvas styles, smooth scroll + scroll-padding-top for header offset
- Created `ClientLayoutEffects` wrapper to mount deep linking, progress bar, and particles globally in layout.tsx
- Enhanced `layout.tsx` with comprehensive SEO metadata (title template, keywords, OG, Twitter Card, robots, canonical URLs, metadataBase)
- Updated `page.tsx` homepage with `data-section` attributes on all 8 sections
- Updated product detail page (`/producto/[slug]`) with enhanced OG/Twitter metadata, `data-section` on 5 sections (product, benefits, specs, description, reviews, related), tab navigation with hash links, copy-link share button
- Updated category page (`/categoria/[slug]`) with enhanced metadata, `data-section` on 4 sections (header, subcategories, filters, products), sort dropdown
- Created `sitemap.ts` generating URLs for all 24 products + 15 categories + homepage
- Created `robots.ts` allowing all crawlers, disallowing /api/ and /admin/
- Build verified: 47 static pages generated successfully, sitemap.xml and robots.txt included

Stage Summary:
- All 47 pages pre-rendered (SSG) with unique URLs
- Section deep linking works via `data-section` attribute + IntersectionObserver + History API replaceState
- Reading progress bar shows on all sub-pages (hidden on homepage)
- Premium gradient scrollbar with blue glow effect
- Glowing particle trail follows mouse cursor
- Full SEO: sitemap.xml, robots.txt, per-product/per-category metadata, OG, Twitter Cards, canonical URLs