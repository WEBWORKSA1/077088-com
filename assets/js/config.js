/* 077088.com — site configuration.
   Edit this ONE file to switch on AdSense, analytics, YouTube channel and payment links.
   Nothing here exposes the owner's inbox. */
window.SITE_CONFIG = {
  siteName: "077088",
  siteUrl: "https://077088.com",
  interestUrl: "https://web.works/contact",

  // Google AdSense — paste your publisher ID (e.g. "ca-pub-1234567890123456").
  // Leave empty to show house ads ("Advertise here") instead of AdSense units.
  adsenseClient: "",
  adsenseSlots: { top: "", inContent: "", sidebar: "", footer: "" },

  // Google Analytics 4 measurement ID (e.g. "G-XXXXXXX"). Optional.
  ga4: "",

  // YouTube channel for the "Subscribe" buttons. Leave empty to hide them.
  youtubeChannel: "",

  // Donation / payment links. Any link left empty is hidden; the pledge form always works.
  donate: {
    paypal: "",          // e.g. https://www.paypal.com/donate/?hosted_button_id=XXXX
    kofi: "",            // e.g. https://ko-fi.com/yourname
    buymeacoffee: "",    // e.g. https://buymeacoffee.com/yourname
    stripe: "",          // e.g. https://buy.stripe.com/XXXX
    githubSponsors: ""   // e.g. https://github.com/sponsors/WEBWORKSA1
  },

  // Transparent fundraising meter (update by hand).
  fundraising: { goal: 8880, raised: 0, currency: "USD" },

  // Social profiles (optional; empty = hidden)
  social: { x: "", instagram: "", tiktok: "", linkedin: "", facebook: "", weibo: "", xiaohongshu: "" }
};
