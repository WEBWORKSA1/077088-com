# 077088.com — Phase-wise Build Prompt

Use these prompts in order with any capable AI coding assistant, or as a brief for a developer. Each phase is self-contained, and each builds on the previous one. **Phases 1–9 are already implemented in this repository.** Phase 10 is the growth roadmap.

---

## Global rules (paste at the top of every phase)

```
Project: 077088.com — "China Number-Day Commerce Hub".
Positioning: festival dates, lucky-number tools and campaign playbooks for people who sell, gift or celebrate
across the Chinese-speaking world — from 7·7 (Qixi) to 8·8 to 11.11.
Stack: static HTML/CSS/vanilla JS with ONE shared Jekyll layout (_layouts/default.html) that GitHub Pages builds
natively on its free plan; pages carry front matter + body; no server, no database, no framework, no Actions needed.
Hard requirements:
- On top of EVERY page, a banner linking to https://web.works/contact:
  "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership".
- All forms deliver to ONE private inbox via FormSubmit AJAX. The address must NEVER appear in HTML, JS strings
  or any file in plain text: store it XOR-encoded and decode only in the browser at submit/click time.
  Fallback: a pre-filled mailto opened by script (no address in markup).
- Relative links only (works on github.io/077088-com/ and on the custom domain).
- Mobile-first: 16px gutters, no horizontal scroll at 375px, light + dark themes, reduced-motion support.
- Accessibility: labels on every input, focus states, skip link, aria on menus and dialogs.
- Trademark safety: "077088" used only as a number/domain; no affiliation claims; third-party marks nominative only.
- No gambling or lottery content (AdSense policy).
```

## Phase 1 — Research & positioning
```
Research the cultural, economic and linguistic meaning of "077088" (digits, homophones, lunar dates, area codes,
numeric-domain market). Audit 25+ leading sites in the niche (zodiac, numerology, Chinese calendar, calculators,
language learning, feng shui, support pages). For each: tools, forms, content types, navigation, design,
monetisation, engagement hooks and SEO patterns. Output: a positioning statement, a must-have feature list,
lead-gen and ad-placement patterns, and a revenue model with explicit assumptions.
```

## Phase 2 — Design system & layout
```
Create assets/css/style.css: tokens on :root (ink, vermilion #D7263D, gold #F2C14E, jade, warm paper #FBF7F0),
dark palette under prefers-color-scheme AND [data-theme="dark"], with a toggle persisted in localStorage (try/catch).
Components: top interest banner, sticky blurred header with dropdown menus and a mobile burger, buttons, cards,
tags, chips, forms with multi-step progress, tables, FAQ accordions, callouts, countdown panel, digit tiles,
score ring, calendar list items, pricing tiers, progress bars, lite YouTube embed, ad slots, consent banner,
sticky mobile CTA, modal, toast and footer. Build _layouts/default.html (head/meta/OG, top banner, header, optional lead strip, footer, consent, modal, scripts)
and page bodies with breadcrumbs, FAQ accordions and JSON-LD (WebSite, Organization, BreadcrumbList, FAQPage,
Article, WebApplication).
```

## Phase 3 — Data layer
```
Create assets/js/data.js: 17 festivals and caution periods with 2026–2030 dates. Convert lunar festivals from
the lunisolar calendar (CNY, Lantern, Dragon Boat, Qixi, Ghost Month start/end, Mid-Autumn, Double Ninth);
Qingming from the 15° solar term; fixed dates for 2.14, 3.8, 5.20, 6.18, 8.8, 9.10, 10.1, 11.11, 12.12.
Also: CNY dates 1924–2044; 12 animals, elements by year digit, trines, six harmonies, clashes and harms;
digits 0–9 (pinyin, homophone, meaning, score); 40+ combinations (code, reading, meaning, tone, weight);
16 gift taboo entries; 10 verified YouTube video IDs.
```

## Phase 4 — Core pages
```
Home: hero with a live countdown to the next major number-day plus the next 4, the "Why 077 088" decode strip,
a tools grid, an embedded Lucky Price Optimizer, a number-day economy table, guides, videos,
contests/support/advertise cards and an FAQ with schema.
Calendar: filter by type and year, days-to-go, per-event and bulk .ics export, printable version.
Numbers explorer: searchable, filterable table linking to the checker. Video library with tag filters.
```

## Phase 5 — Interactive tools (assets/js/tools.js)
```
1 Lucky Price Optimizer: candidates within ±range ending 8/88/68/168/888/66/99 plus lucky cents; filter out
  any 4 and 250; score and rank by score and closeness; best above/below; copyable pills.
2 Number Luck Checker: digit tiles, greedy longest-first combo detection, ending-weighted 1–99 score,
  4-penalty cap, tips; shareable ?n= URL.
3 Chinese Number Converter: 小写, 大写 banker's numerals, RMB 元角分整, digit-by-digit, pinyin (1 = yāo).
4 Hongbao Calculator: occasion × relationship ranges (CNY base), currency conversion with local factors,
  lucky 4-free rounding, odd amounts in white envelopes for funerals.
5 Launch Date Checker: date digits, Ghost Month/Qingming flags, 4-days, festivals within 21 days.
6 Campaign Planner: T-90…T+3 milestones, budget split, .ics export, copy checklist, CTA prefilled to the brief.
7 Zodiac Finder & Compatibility: New-Year boundary, element, yin/yang, allies/clash, Ben Ming Nian,
  pair compatibility, 1924–2043 year table.
8 Gift Taboo Checker: search, filter and alternatives.
Each tool page: tool first → ad → explainer → FAQ (schema) → sidebar (tools, ad, lead CTA, donate).
```

## Phase 6 — Content & SEO
```
15 festival pages (dates table, sections, video, FAQ, campaign CTA, share buttons, TOC sidebar).
8 guides (what 077088 means, number-day economy, lucky pricing, Qixi playbook, hongbao etiquette,
gift taboos, number slang, lucky numbers for business) with sources, bylines and FAQ schema.
sitemap.xml, robots.txt, canonical URLs, OG/Twitter tags (add a 1200×630 og.png later), manifest, favicon,
_config.yml, and a 404 page with a dynamic <base>.
```

## Phase 7 — Monetisation
```
config.js holds: adsenseClient + slot IDs (empty = house "Advertise here" ads linking to advertise.html),
GA4 ID, YouTube channel URL, donation links (PayPal, Ko-fi, BMC, Stripe, GitHub Sponsors), fundraising meter
and social URLs. Ad slots: top, in-content (after the first section), sidebar, footer. ads.txt template.
Advertise page: 4 packages (Tool Sponsorship $288/mo, Festival Takeover $888/festival, Newsletter $168/issue,
Partner Directory $88/mo) and a media-kit form. YouTube: privacy-enhanced click-to-load embeds and a
Subscribe button shown when configured.
```

## Phase 8 — Lead generation (the core business)
```
services.html "Brand Growth Desk": hero promise, 8 services, 3-step process, a 3-step brief form
(needs chips, target festival, market → company, category, budget → contact, consent, newsletter),
a partner-network application and an FAQ. Sitewide: a dark lead strip before the footer, an exit-intent /
45-second lead-magnet modal (2027 calendar → reveals the printable calendar), tool-result CTAs,
query-string prefill (?need=, ?fest=, ?plan=, ?role=), a sticky mobile CTA, a newsletter in the footer,
and a gtag generate_lead event.
```

## Phase 9 — Community, donations, legal
```
support.html: lucky amounts ($6.66 / $8.88 / $16.80 / $52 / $88 / custom), frequency, designation
(operations, promotions, marketing, hiring, contests & prizes, tools), a pledge form, config-driven payment
buttons, fundraising meter, use-of-funds table, tiers and a supporters wall.
contests.html: 3 contests, prizes, judging, entry form, rules (no purchase necessary, void where prohibited).
careers.html: 7 roles, application form and a talent-request CTA for brands.
about, contact (form + script-only mailto), legal (trademark/copyright disclosure, takedown process,
disclaimer, advertising disclosure), privacy (AdSense/consent/YouTube), terms. Consent banner.
QA: no console errors, no horizontal overflow at 375px, email string absent from all files, forms tested.
```

## Phase 10 — Growth roadmap (next)
```
1 Programmatic number pages /n/000–/n/999 with unique analysis + famous-combo context (1,000 long-tail pages).
2 Zodiac sign pages (12) and pair pages (78) with 2027 Goat-year forecasts clearly labelled as folklore.
3 Simplified and Traditional Chinese versions with hreflang (/zh-hans/, /zh-hant/).
4 Daily "number of the day" and almanac-style date pages for 2027.
5 Newsletter automation (Buttondown/Mailchimp) with festival drip sequences 30/14/7/1 days out.
6 YouTube Shorts series "Number-Day in 60 seconds", embedded on each festival page.
7 Partner directory pages generated from a JSON list; paid featured slots.
8 Custom domain: add CNAME 077088.com, set A records to GitHub Pages, and enforce HTTPS.
```
