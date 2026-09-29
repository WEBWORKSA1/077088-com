# 077088.com — China Number-Day Commerce Hub

Festival dates, lucky-number tools and campaign playbooks for people who sell, gift or celebrate across the Chinese-speaking world, from **7·7 (Qixi)** to **8·8** to **11.11**.

The site is monetised with AdSense (or house ads until AdSense is set up), YouTube, sponsorships, a partner directory, Brand Growth Desk leads, donations and contests.

**Live:** https://webworksa1.github.io/077088-com/ (and https://077088.com once DNS is pointed)

**Docs in this repo:**
- Research & strategy: [`docs/RESEARCH-AND-STRATEGY.md`](docs/RESEARCH-AND-STRATEGY.md)
- Phase-wise build prompt: [`docs/BUILD-PROMPT.md`](docs/BUILD-PROMPT.md)

## What's inside
- **51 pages:**
  - home, calendar, printable calendar, numbers explorer, videos;
  - 15 festival pages and a festivals index;
  - 8 tools and a tools index;
  - 8 guides and a guides index;
  - services (lead generation), advertise, support, contests, careers, about, contact;
  - legal, privacy, terms, 404, thanks.
- **8 tools:** Lucky Price Optimizer, Number Luck Checker, Chinese Number Converter (大写), Hongbao Calculator, Launch Date Checker, Campaign Planner (.ics export), Zodiac Finder & Compatibility, Gift Taboo Checker.
- **Lead generation:**
  - a 3-step Brand Growth Desk brief;
  - a lead strip on every page;
  - an exit-intent lead magnet;
  - partner applications;
  - advertiser, contest and careers forms;
  - a newsletter.
- **SEO:** JSON-LD (FAQPage, Article, WebApplication, Breadcrumb), sitemap.xml, robots.txt, canonical and OG tags.

## How it works (GitHub Pages free plan)
```
_layouts/default.html   shared <head>, top interest banner, header/nav, lead strip, footer, consent, modal, scripts
*.html, festivals/, tools/, guides/   pages = front matter (title, description, root, canonical) + body
assets/css/style.css    design system (light/dark)
assets/js/config.js     EDIT ME — AdSense, GA4, YouTube, donation links, socials, fundraising meter
assets/js/data.js       festival dates 2026–2030, CNY 1924–2044, zodiac, number meanings, gifts, videos
assets/js/app.js        forms, ads, theme, countdown, consent, modal, share, video embeds
assets/js/tools.js      the 8 interactive tools
docs/                   research, strategy and the phase-wise build prompt
```
GitHub Pages builds the site with its built-in Jekyll on every push. No build step or Actions workflow is needed.

**Editing:**
- To change the header, footer or top banner sitewide, edit `_layouts/default.html`.
- To change a page, edit its HTML body below the front matter.
- Page bodies are wrapped in `{% raw %}` so Liquid never alters them.

## One-time setup
1. **GitHub Pages:** in Settings → Pages, choose *Deploy from a branch → gh-pages → / (root)* if it isn't already set.
2. **Forms (FormSubmit):**
   - Submit any form on the live site once.
   - FormSubmit emails an activation link to the owner inbox. Click it.
   - After that, every lead, pledge, application and contest entry arrives in that inbox.
3. **AdSense:**
   - Put your `ca-pub-…` ID and slot IDs in `assets/js/config.js`.
   - Replace the placeholder line in `ads.txt`.
4. **Donations:** add your PayPal, Ko-fi, Buy Me a Coffee, Stripe or GitHub Sponsors links in `config.js`. Empty links stay hidden; the pledge form always works.
5. **Social preview:** upload a 1200×630 `assets/img/og.png`, then add `<meta property="og:image" content="https://077088.com/assets/img/og.png">` to the layout.
6. **Custom domain:**
   - In Settings → Pages, add `077088.com`.
   - At your registrar, add A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
   - Add a `www` CNAME pointing to `webworksa1.github.io`.
   - Then turn on *Enforce HTTPS*.
   - All links are relative, so the site works on both URLs.

## Privacy of the contact inbox
The owner's email address is never written in plain text in any file. It is XOR-encoded in `assets/js/app.js` and decoded in the visitor's browser only when a form is sent or the "Email us" link is clicked.

## Legal
Content © 2026 077088.com, all rights reserved. "077088" is used as a number and domain name; the site has no affiliation with any company, brand, stock code or phone number that uses the same digits. Third-party marks belong to their owners. See `legal.html`.

Website, domain, sponsorship, advertising or partnership enquiries: https://web.works/contact
