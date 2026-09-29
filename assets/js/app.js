/* 077088.com — core site behaviour (no dependencies) */
(function () {
  "use strict";
  const C = window.SITE_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const sstore = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Owner inbox: encoded, decoded only in the browser at send time ---------- */
  const _k = "七七八八077088";
  const _e = [20084, 20070, 20745, 20764, 95, 69, 92, 67, 89, 9, 20035, 20068, 20742, 20746, 89, 91, 25, 83, 87, 85];
  const inbox = () => _e.map((n, i) => String.fromCharCode(n ^ _k.charCodeAt(i % _k.length))).join("");

  /* ---------- Utilities ---------- */
  const U = (window.U = {
    $, $$, store,
    toast(msg) {
      let t = $(".toast");
      if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
      t.textContent = msg; t.classList.add("show");
      clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2400);
    },
    parse(d) { const [y, m, dd] = d.split("-").map(Number); return new Date(y, m - 1, dd); },
    fmt(d, opts) { return (typeof d === "string" ? U.parse(d) : d).toLocaleDateString("en-US", opts || { weekday: "short", month: "short", day: "numeric", year: "numeric" }); },
    today() { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); },
    daysUntil(d) { return Math.round((U.parse(d) - U.today()) / 86400000); },
    occurrences(includePast) {
      const out = [];
      (window.D ? D.festivals : []).forEach(f => Object.entries(f.dates).forEach(([y, d]) => out.push({ f, y: +y, d })));
      out.sort((a, b) => a.d.localeCompare(b.d));
      return includePast ? out : out.filter(o => U.daysUntil(o.d) >= 0);
    },
    nextOf(slug) { return U.occurrences().find(o => o.f.slug === slug); },
    esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); },
    copy(text) {
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
        () => U.toast("Copied to clipboard"),
        () => { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); U.toast("Copied"); } catch (e) {} ta.remove(); }
      );
    },
    ics(events, filename) {
      const pad = n => String(n).padStart(2, "0");
      const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//077088.com//Number-Day Calendar//EN", "CALSCALE:GREGORIAN"];
      events.forEach((e, i) => {
        const s = U.parse(e.date); const n = new Date(s); n.setDate(n.getDate() + (e.days || 1));
        const f = d => d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
        lines.push("BEGIN:VEVENT", `UID:${f(s)}-${i}-${Math.random().toString(36).slice(2)}@077088.com`, `DTSTAMP:${stamp}`,
          `DTSTART;VALUE=DATE:${f(s)}`, `DTEND;VALUE=DATE:${f(n)}`, `SUMMARY:${e.title.replace(/[,;]/g, " ")}`,
          `DESCRIPTION:${(e.desc || "").replace(/[,;]/g, " ").replace(/\n/g, "\\n")} — 077088.com`, "END:VEVENT");
      });
      lines.push("END:VCALENDAR");
      const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename || "077088-calendar.ics";
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    },
    mail(subject, body) {
      window.location.href = "mai" + "lto:" + inbox() + "?subject=" + encodeURIComponent(subject || "077088.com enquiry") + (body ? "&body=" + encodeURIComponent(body) : "");
    }
  });

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const saved = store.get("theme");
  if (saved) root.setAttribute("data-theme", saved);
  $$("[data-theme-toggle]").forEach(b => b.addEventListener("click", () => {
    const dark = root.getAttribute("data-theme") ? root.getAttribute("data-theme") === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = dark ? "light" : "dark"; root.setAttribute("data-theme", next); store.set("theme", next);
  }));

  /* ---------- Mobile nav ---------- */
  const burger = $(".burger"), menu = $(".menu");
  if (burger && menu) burger.addEventListener("click", () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });

  /* ---------- Mail links (no address in the markup) ---------- */
  $$("[data-mail]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); U.mail(a.getAttribute("data-mail")); }));

  /* ---------- Forms → FormSubmit (AJAX) ---------- */
  function serialize(form) {
    const data = {};
    new FormData(form).forEach((v, k) => {
      if (k.startsWith("_hp")) return;
      if (data[k]) data[k] = data[k] + ", " + v; else data[k] = v;
    });
    return data;
  }
  async function send(form) {
    const msg = $(".form-msg", form) || (() => { const m = document.createElement("div"); m.className = "form-msg"; form.appendChild(m); return m; })();
    const hp = $(".hp input", form);
    if (hp && hp.value) return; // bot
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const btn = $("[type=submit]", form); const label = btn ? btn.innerHTML : "";
    if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
    const data = serialize(form);
    const kind = form.getAttribute("data-form") || "Enquiry";
    data._subject = `077088.com — ${kind}` + (data.name ? ` — ${data.name}` : "");
    data._template = "table"; data._captcha = "false";
    data["Form type"] = kind; data["Page"] = location.href; data["Submitted"] = new Date().toString();
    if (data.email) data._replyto = data.email;
    try {
      const r = await fetch("https://formsubmit.co/ajax/" + inbox(), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || String(j.success) === "false") throw new Error(j.message || "Send failed");
      msg.className = "form-msg ok"; msg.textContent = form.getAttribute("data-ok") || "Thank you! Your message was received — we reply within 1 business day.";
      form.reset(); form.dispatchEvent(new CustomEvent("sent", { detail: data }));
      if (window.gtag) gtag("event", "generate_lead", { form_type: kind });
      const reveal = form.getAttribute("data-reveal"); if (reveal && $(reveal)) $(reveal).hidden = false;
    } catch (err) {
      msg.className = "form-msg err";
      msg.innerHTML = 'We couldn\'t send that automatically. <a href="#" class="fallback">Send it by email instead</a> — your answers are pre-filled.';
      $(".fallback", msg).addEventListener("click", e => {
        e.preventDefault();
        const body = Object.entries(data).filter(([k]) => !k.startsWith("_")).map(([k, v]) => `${k}: ${v}`).join("\n");
        U.mail(data._subject, body);
      });
    } finally { if (btn) { btn.disabled = false; btn.innerHTML = label; } }
  }
  $$("form[data-form]").forEach(f => {
    if (!$(".hp", f)) { const h = document.createElement("div"); h.className = "hp"; h.setAttribute("aria-hidden", "true"); h.innerHTML = '<label>Leave empty<input name="_hp_company" tabindex="-1" autocomplete="off"></label>'; f.prepend(h); }
    f.setAttribute("novalidate", "");
    f.addEventListener("submit", e => { e.preventDefault(); send(f); });
  });

  /* ---------- Multi-step forms ---------- */
  $$("[data-steps]").forEach(form => {
    const steps = $$(".step", form); const bar = $(".steps-bar", form); let i = 0;
    if (bar) bar.innerHTML = steps.map(() => "<i></i>").join("");
    const show = n => { steps.forEach((s, k) => s.classList.toggle("active", k === n)); if (bar) $$("i", bar).forEach((b, k) => b.classList.toggle("on", k <= n)); i = n; };
    form.addEventListener("click", e => {
      if (e.target.closest("[data-next]")) {
        e.preventDefault();
        const bad = $$("input,select,textarea", steps[i]).find(el => !el.checkValidity());
        if (bad) { bad.reportValidity(); return; }
        show(Math.min(i + 1, steps.length - 1));
      }
      if (e.target.closest("[data-prev]")) { e.preventDefault(); show(Math.max(i - 1, 0)); }
    });
    form.addEventListener("sent", () => show(0));
    show(0);
  });

  /* ---------- Ads: AdSense if configured, otherwise house ads ---------- */
  const slots = $$(".ad-slot");
  if (slots.length) {
    const pub = (C.adsenseClient || "").trim();
    if (pub) {
      const s = document.createElement("script"); s.async = true; s.crossOrigin = "anonymous";
      s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(pub);
      document.head.appendChild(s);
      slots.forEach(el => {
        const pos = el.getAttribute("data-ad") || "inContent"; const slot = (C.adsenseSlots || {})[pos] || "";
        el.innerHTML = '<div class="ad-label">Advertisement</div><ins class="adsbygoogle" style="display:block" data-ad-client="' + pub + '"' + (slot ? ' data-ad-slot="' + slot + '"' : "") + ' data-ad-format="auto" data-full-width-responsive="true"></ins>';
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      });
    } else {
      const base = document.body.getAttribute("data-root") || "";
      slots.forEach(el => {
        el.innerHTML = '<div class="ad-label">Sponsored</div><div class="house-ad"><div><b>Reach brands & shoppers planning for China\'s number-days.</b><div class="small muted">Sponsor this slot on 077088.com — festival takeovers from 7·7 to 11.11.</div></div><a class="btn btn-gold btn-sm" href="' + base + 'advertise.html">Advertise here</a></div>';
      });
    }
  }

  /* ---------- Analytics ---------- */
  if (C.ga4) {
    const g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + C.ga4; document.head.appendChild(g);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", C.ga4, { anonymize_ip: true });
  }

  /* ---------- YouTube (privacy-enhanced, click-to-load) ---------- */
  $$(".yt[data-id]").forEach(el => {
    const id = el.getAttribute("data-id");
    el.innerHTML = '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg"><div class="play"><i></i></div>';
    el.setAttribute("role", "button"); el.setAttribute("tabindex", "0"); el.setAttribute("aria-label", "Play video: " + (el.getAttribute("data-title") || ""));
    const play = () => { el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + U.esc(el.getAttribute("data-title") || "Video") + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'; };
    el.addEventListener("click", play); el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } });
  });
  $$("[data-yt-channel]").forEach(a => { if (C.youtubeChannel) { a.href = C.youtubeChannel; a.hidden = false; } else a.hidden = true; });

  /* ---------- Donation links from config ---------- */
  $$("[data-donate]").forEach(a => { const u = (C.donate || {})[a.getAttribute("data-donate")]; if (u) { a.href = u; a.hidden = false; } else a.hidden = true; });
  $$("[data-social]").forEach(a => { const u = (C.social || {})[a.getAttribute("data-social")]; if (u) { a.href = u; a.hidden = false; } else a.hidden = true; });
  const fr = C.fundraising || {};
  $$("[data-raised]").forEach(el => el.textContent = (fr.raised || 0).toLocaleString());
  $$("[data-goal]").forEach(el => el.textContent = (fr.goal || 0).toLocaleString());
  $$("[data-progress]").forEach(el => el.style.width = Math.min(100, fr.goal ? (fr.raised / fr.goal) * 100 : 0) + "%");

  /* ---------- Countdown to next major number-day ---------- */
  const cd = $("#countdown");
  if (cd && window.D) {
    const upcoming = U.occurrences().filter(o => o.f.star);
    const next = upcoming[0];
    const base = document.body.getAttribute("data-root") || "";
    if (next) {
      $(".cd-name", cd).textContent = next.f.name;
      $(".cd-cn", cd).textContent = next.f.cn;
      $(".cd-date", cd).textContent = U.fmt(next.d, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
      const link = $(".cd-link", cd); if (link) link.href = base + "festivals/" + (next.f.page || next.f.slug) + ".html";
      const target = U.parse(next.d);
      const tick = () => {
        let ms = Math.max(0, target - new Date());
        const d = Math.floor(ms / 864e5); ms -= d * 864e5; const h = Math.floor(ms / 36e5); ms -= h * 36e5; const m = Math.floor(ms / 6e4); const s = Math.floor((ms - m * 6e4) / 1000);
        $(".cd-units", cd).innerHTML = [[d, "days"], [h, "hrs"], [m, "min"], [s, "sec"]].map(([v, l]) => `<div><b>${String(v).padStart(2, "0")}</b><span>${l}</span></div>`).join("");
      };
      tick(); setInterval(tick, 1000);
      $(".cd-next", cd).innerHTML = upcoming.slice(1, 5).map(o => `<li><a href="${base}festivals/${o.f.page || o.f.slug}.html">${U.esc(o.f.name)}</a><span>${U.fmt(o.d, { month: "short", day: "numeric", year: "numeric" })}</span></li>`).join("");
    }
  }

  /* ---------- Consent banner ---------- */
  const consent = $(".consent");
  if (consent && !store.get("consent")) {
    consent.classList.add("show");
    $$("[data-consent]", consent).forEach(b => b.addEventListener("click", () => { store.set("consent", b.getAttribute("data-consent")); consent.classList.remove("show"); }));
  }

  /* ---------- Sticky mobile CTA ---------- */
  const mcta = $(".mobile-cta");
  if (mcta) addEventListener("scroll", () => mcta.classList.toggle("show", scrollY > 700 && !(consent && consent.classList.contains("show"))), { passive: true });

  /* ---------- Exit-intent lead magnet (desktop, once per session) ---------- */
  const modal = $("#lead-modal");
  if (modal) {
    const open = () => { if (sstore.get("lm")) return; sstore.set("lm", "1"); modal.classList.add("show"); };
    document.addEventListener("mouseout", e => { if (!e.relatedTarget && e.clientY < 8 && innerWidth > 900) open(); });
    setTimeout(() => { if (scrollY > 1400) open(); }, 45000);
    $$("[data-close]", modal).forEach(b => b.addEventListener("click", () => modal.classList.remove("show")));
    modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("show"); });
    addEventListener("keydown", e => { if (e.key === "Escape") modal.classList.remove("show"); });
  }

  /* ---------- Share ---------- */
  $$("[data-share]").forEach(b => b.addEventListener("click", e => {
    e.preventDefault();
    const net = b.getAttribute("data-share"); const url = encodeURIComponent(location.href); const t = encodeURIComponent(document.title);
    const map = { x: `https://twitter.com/intent/tweet?url=${url}&text=${t}`, facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`, whatsapp: `https://wa.me/?text=${t}%20${url}`, linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` };
    if (net === "native" && navigator.share) navigator.share({ title: document.title, url: location.href }).catch(() => {});
    else if (map[net]) window.open(map[net], "_blank", "noopener,width=640,height=560");
    else U.copy(location.href);
  }));

  /* ---------- Reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .08 });
    $$(".reveal").forEach(el => io.observe(el));
  } else $$(".reveal").forEach(el => el.classList.add("in"));

  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
})();
