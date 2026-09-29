/* 077088.com — interactive tools. Each tool activates only if its container exists. */
(function () {
  "use strict";
  const { $, $$, esc } = window.U;
  const base = document.body.getAttribute("data-root") || "";

  /* ================= Number analysis engine ================= */
  const Engine = (window.NumberEngine = {
    analyze(raw) {
      const s = String(raw).replace(/[^0-9]/g, "");
      if (!s) return null;
      const digits = s.split("").map((d, i) => ({ d, i, ...D.digits[d] }));
      // greedy combo detection, longest first, non-overlapping
      const used = new Array(s.length).fill(false); const found = [];
      const combos = D.combos.slice().sort((a, b) => b[0].length - a[0].length);
      combos.forEach(([code, cn, meaning, tone, w]) => {
        let from = 0, idx;
        while ((idx = s.indexOf(code, from)) !== -1) {
          const range = [...Array(code.length).keys()].map(k => idx + k);
          if (range.every(k => !used[k])) { range.forEach(k => used[k] = true); found.push({ code, cn, meaning, tone, w, at: idx }); }
          from = idx + 1;
        }
      });
      found.sort((a, b) => a.at - b.at);
      let raw_ = 0;
      digits.forEach((x, i) => { const endW = i === digits.length - 1 ? 2 : (i === digits.length - 2 ? 1.4 : 1); raw_ += x.score * endW; });
      found.forEach(c => raw_ += c.w * 1.2);
      const fours = (s.match(/4/g) || []).length; const eights = (s.match(/8/g) || []).length;
      const norm = raw_ / Math.sqrt(Math.max(1, s.length));
      let score = Math.round(50 + norm * 11);
      if (fours) score = Math.min(score - 8 * fours, 52 - 6 * (fours - 1));
      score = Math.max(1, Math.min(99, score));
      const verdict = score >= 85 ? ["Excellent", "Highly auspicious — a premium number."] :
        score >= 70 ? ["Very good", "Positive associations dominate."] :
        score >= 55 ? ["Good", "Mostly positive with neutral digits."] :
        score >= 40 ? ["Neutral", "Nothing alarming, nothing special."] :
        score >= 25 ? ["Weak", "Contains digits or pairs many buyers avoid."] : ["Avoid", "Strong negative associations for Chinese-speaking audiences."];
      return { s, digits, found, score, verdict, fours, eights };
    },
    ringColor(score) { return score >= 70 ? "var(--jade)" : score >= 45 ? "var(--gold)" : "var(--bad)"; },
    render(a, opts = {}) {
      const cls = x => x.score >= 1 ? "good" : x.score <= -1 ? "bad" : (x.score > 0 ? "mix" : "");
      const combos = a.found.length ? `<h3 style="margin-top:18px">Patterns found</h3><div class="table-wrap"><table><thead><tr><th>Pattern</th><th>Reads as</th><th>Meaning</th></tr></thead><tbody>${a.found.map(c => `<tr><td><b>${c.code}</b> <span class="tag ${c.tone === "bad" ? "red" : c.tone === "good" ? "jade" : "gold"}">${c.tone}</span></td><td class="cn">${esc(c.cn)}</td><td>${esc(c.meaning)}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted small" style="margin-top:12px">No famous combinations detected — the score is driven by individual digits.</p>`;
      const tips = [];
      if (a.fours) tips.push(`Contains <b>${a.fours}× 4</b> (sì ≈ 死 sǐ, “death”). For Chinese-speaking customers, replace 4s where you can.`);
      if (a.s.endsWith("8")) tips.push("Ends in <b>8</b> (发, prosperity) — the strongest possible ending.");
      else if (/[69]$/.test(a.s)) tips.push("Ends in 6 or 9 — smooth / long-lasting. A good ending.");
      if (a.s.includes("250")) tips.push("Contains <b>250</b> (二百五, “idiot”). Avoid for prices and gifts.");
      if (!a.eights && a.s.length > 3) tips.push("No 8s at all — adding one (ideally at the end) lifts perceived luck the most.");
      return `<div class="score"><div class="ring" style="--p:${a.score};--c:${Engine.ringColor(a.score)}"><b>${a.score}</b></div><div><div class="tag ${a.score >= 70 ? "jade" : a.score >= 45 ? "gold" : "red"}">${a.verdict[0]}</div><h3 style="margin:.4em 0 .2em">${esc(opts.label || "Number")} ${esc(a.s)}</h3><p class="muted" style="margin:0">${a.verdict[1]} <span class="small">(Cultural-association score out of 99 — for fun & marketing insight, not a prediction.)</span></p></div></div>
      <div class="digits">${a.digits.map(x => `<div class="digit ${cls(x)}" title="${esc(x.meaning)}"><b>${x.d}</b><span class="cn">${x.cn}</span><small>${x.py}</small></div>`).join("")}</div>
      ${tips.length ? `<ul>${tips.map(t => `<li>${t}</li>`).join("")}</ul>` : ""}${combos}`;
    }
  });

  /* ================= Number checker ================= */
  const nc = $("#tool-checker");
  if (nc) {
    const inp = $("#nc-input"), type = $("#nc-type"), out = $("#nc-result");
    const run = () => {
      const a = Engine.analyze(inp.value);
      if (!a) { out.classList.remove("show"); return; }
      out.innerHTML = Engine.render(a, { label: type.options[type.selectedIndex].text }) + `<div class="callout good" style="margin-top:18px"><b>Want a better number?</b> Our partners source lucky phone numbers, numeric domains and vanity numbers. <a href="${base}services.html#brief">Request a sourcing quote →</a></div>`;
      out.classList.add("show");
      history.replaceState(null, "", "?n=" + a.s);
    };
    $("#nc-go").addEventListener("click", run);
    inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); run(); } });
    $$("[data-try]", nc).forEach(b => b.addEventListener("click", () => { inp.value = b.getAttribute("data-try"); run(); }));
    const q = new URLSearchParams(location.search).get("n"); inp.value = q || "077088"; run();
  }

  /* ================= Lucky price optimizer ================= */
  const lp = $("#tool-price");
  if (lp) {
    const endings = ["8", "88", "68", "66", "99", "98", "58", "168", "188", "888", "688", "988", "1688", "8888", "666", "999", "9", "6"];
    const cents = ["", ".88", ".68", ".66", ".99", ".98", ".08", ".80"];
    const noFour = s => !/4/.test(s);
    function candidates(p, range) {
      const lo = p * (1 - range), hi = p * (1 + range); const set = new Map();
      const ip = Math.floor(p); const len = String(Math.max(1, Math.floor(hi))).length;
      for (const e of endings) {
        if (e.length > len) continue;
        const mod = Math.pow(10, e.length);
        for (let head = Math.floor(lo / mod) - 1; head <= Math.floor(hi / mod) + 1; head++) {
          if (head < 0) continue;
          const n = head * mod + Number(e);
          for (const c of (p < 1000 ? cents : [""])) {
            const v = Number((n + (c ? Number(c) : 0)).toFixed(2));
            if (v < lo || v > hi || v <= 0) continue;
            const str = c ? n + c : String(n);
            if (!noFour(str)) continue;
            if (/250/.test(String(n))) continue;
            if (!set.has(str)) set.set(str, v);
          }
        }
      }
      if (p < 1000) {
        for (let n = Math.max(0, Math.floor(lo)); n <= Math.ceil(hi) && n - lo < 400; n++) {
          if (/4/.test(String(n))) continue;
          for (const c of [".88", ".68", ".66", ".99", ".98", ".80", ".08"]) {
            const v = Number((n + Number(c)).toFixed(2)); const str = n + c;
            if (v >= lo && v <= hi && v > 0 && !set.has(str)) set.set(str, v);
          }
        }
      }
      return [...set.entries()].map(([str, v]) => { const a = Engine.analyze(str.replace(".", "")); return { str, v, score: a.score, a }; });
    }
    const run = () => {
      const p = parseFloat($("#lp-price").value); const cur = $("#lp-cur").value; const range = parseFloat($("#lp-range").value) / 100;
      const out = $("#lp-result");
      if (!(p > 0)) { out.classList.remove("show"); return; }
      const orig = Engine.analyze(String(p).replace(".", ""));
      const list = candidates(p, range).map(c => ({ ...c, dist: Math.abs(c.v - p) / p }));
      list.forEach(c => c.rank = c.score - c.dist * 220);
      list.sort((a, b) => b.rank - a.rank);
      const top = list.slice(0, 8);
      const below = list.filter(c => c.v <= p).sort((a, b) => b.rank - a.rank)[0];
      const above = list.filter(c => c.v > p).sort((a, b) => b.rank - a.rank)[0];
      const fmt = c => `${cur}${Number(c.v).toLocaleString(undefined, { minimumFractionDigits: c.str.includes(".") ? 2 : 0, maximumFractionDigits: 2 })}`;
      out.innerHTML = `<div class="grid g3">
        <div class="card"><div class="small muted">Your price</div><div class="big-out">${cur}${p.toLocaleString()}</div><div class="tag ${orig.score >= 70 ? "jade" : orig.score >= 45 ? "gold" : "red"}">Score ${orig.score} · ${orig.verdict[0]}</div></div>
        <div class="card"><div class="small muted">Best at or below</div><div class="big-out" style="color:var(--jade)">${below ? fmt(below) : "—"}</div>${below ? `<div class="tag jade">Score ${below.score}</div> <span class="small muted">${((below.v - p) / p * 100).toFixed(1)}%</span>` : ""}</div>
        <div class="card"><div class="small muted">Best above</div><div class="big-out" style="color:var(--gold)">${above ? fmt(above) : "—"}</div>${above ? `<div class="tag gold">Score ${above.score}</div> <span class="small muted">+${((above.v - p) / p * 100).toFixed(1)}%</span>` : ""}</div>
      </div>
      <h3 style="margin-top:20px">All auspicious options within ±${Math.round(range * 100)}%</h3>
      <div class="pill-list">${top.map(c => `<button class="pill" data-copy="${c.str}" title="Score ${c.score}">${fmt(c)} <span class="small muted">· ${c.score}</span></button>`).join("")}</div>
      ${orig.fours ? `<div class="callout warn" style="margin-top:16px">⚠️ Your current price contains <b>4</b> — research on Chinese price advertising (Simmons & Schindler, <i>Journal of International Marketing</i>, 2003) found 4 is systematically avoided and 8 favoured.</div>` : ""}
      <p class="small muted" style="margin-top:14px">Tip: click a price to copy it. For China-facing ads, many retailers end prices in 8 (e.g. 168, 1,288, 2,888) and keep 4 out of every position.</p>`;
      out.classList.add("show");
      $$("[data-copy]", out).forEach(b => b.addEventListener("click", () => U.copy(b.getAttribute("data-copy"))));
    };
    $("#lp-go").addEventListener("click", run);
    $("#lp-price").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); run(); } });
    $("#lp-range").addEventListener("input", () => { $("#lp-range-v").textContent = $("#lp-range").value + "%"; run(); });
    $("#lp-cur").addEventListener("change", run);
    run();
  }

  /* ================= Chinese number converter ================= */
  const CN = (window.CNNum = {
    std: "零一二三四五六七八九", cap: "零壹贰叁肆伍陆柒捌玖",
    py: ["líng", "yī", "èr", "sān", "sì", "wǔ", "liù", "qī", "bā", "jiǔ"],
    section(n, cap) {
      const D_ = cap ? CN.cap : CN.std; const U4 = cap ? ["", "拾", "佰", "仟"] : ["", "十", "百", "千"];
      let s = "", zero = false; const str = String(n).padStart(4, "0");
      for (let i = 0; i < 4; i++) {
        const d = +str[i]; const unit = U4[3 - i];
        if (d === 0) { if (s) zero = true; }
        else { if (zero) { s += D_[0]; zero = false; } s += D_[d] + unit; }
      }
      return s;
    },
    int(n, cap) {
      n = BigInt(n);
      if (n === 0n) return (cap ? CN.cap : CN.std)[0];
      const big = cap ? ["", "万", "亿", "万亿"] : ["", "万", "亿", "万亿"];
      const parts = []; let x = n;
      while (x > 0n) { parts.push(Number(x % 10000n)); x = x / 10000n; }
      let out = "", needZero = false;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        if (p === 0) { needZero = out.length > 0; continue; }
        if (out && (needZero || p < 1000)) out += (cap ? CN.cap : CN.std)[0];
        out += CN.section(p, cap).replace(/^零+/, "") + big[i]; needZero = false;
      }
      if (!cap) out = out.replace(/^一十/, "十");
      return out;
    },
    money(v) {
      const [i, f = ""] = v.split(".");
      const intPart = BigInt(i || "0"); const jiao = +(f[0] || 0), fen = +(f[1] || 0);
      let s = intPart > 0n ? CN.int(intPart, true) + "元" : "";
      if (!jiao && !fen) return (s || "零元") + "整";
      if (jiao) s += CN.cap[jiao] + "角"; else if (s && fen) s += "零";
      if (fen) s += CN.cap[fen] + "分";
      return s;
    },
    spoken(digits) { return digits.split("").map(d => d === "1" ? "yāo" : CN.py[+d]).join(" "); }
  });
  const cv = $("#tool-converter");
  if (cv) {
    const run = () => {
      const raw = $("#cv-input").value.replace(/[, _]/g, "");
      const out = $("#cv-result");
      if (!/^\d{1,16}(\.\d{0,2})?$/.test(raw)) { out.innerHTML = raw ? '<p class="form-msg err" style="display:block">Enter a number up to 16 digits with up to 2 decimals.</p>' : ""; out.classList.toggle("show", !!raw); return; }
      const [i, f] = raw.split(".");
      const rows = [
        ["Chinese numerals (小写)", CN.int(i, false) + (f ? "点" + f.split("").map(d => CN.std[+d]).join("") : "")],
        ["Financial / banker's numerals (大写)", CN.int(i, true) + (f ? "点" + f.split("").map(d => CN.cap[+d]).join("") : "")],
        ["Amount in words for cheques & invoices (人民币)", "人民币" + CN.money(raw)],
        ["Digit-by-digit (phone / code style)", raw.replace(".", "").split("").map(d => CN.std[+d]).join("")],
        ["Pinyin, digit-by-digit (1 = yāo)", CN.spoken(raw.replace(".", ""))],
        ["Pinyin, digit-by-digit (standard)", raw.replace(".", "").split("").map(d => CN.py[+d]).join(" ")]
      ];
      out.innerHTML = `<div class="table-wrap"><table><tbody>${rows.map(([k, v]) => `<tr><th style="width:38%">${k}</th><td><span class="cn" style="font-size:1.15rem">${esc(v)}</span> <button class="btn btn-ghost btn-sm copy" data-copy="${esc(v)}">Copy</button></td></tr>`).join("")}</tbody></table></div>`;
      out.classList.add("show");
      $$("[data-copy]", out).forEach(b => b.addEventListener("click", () => U.copy(b.getAttribute("data-copy"))));
    };
    $("#cv-input").addEventListener("input", run); $("#cv-input").value = "077088"; run();
    $$("[data-try]", cv).forEach(b => b.addEventListener("click", () => { $("#cv-input").value = b.getAttribute("data-try"); run(); }));
  }

  /* ================= Hongbao calculator ================= */
  const hb = $("#tool-hongbao");
  if (hb) {
    // Base ranges in CNY (mainland conventions). Sources: ChinaHighlights red-envelope guide + common etiquette guides.
    const R = {
      cny: { own_child: [200, 1000], young_relative: [100, 500], parents: [1000, 3000], grandparents: [500, 2000], friend_child: [50, 200], employee: [100, 1000], colleague_child: [50, 200], service_staff: [20, 100] },
      wedding: { close_family: [1000, 6000], close_friend: [600, 2000], friend: [300, 1000], colleague: [200, 800], acquaintance: [200, 500] },
      birthday: { parents: [888, 3000], grandparents: [666, 2000], friend: [200, 600], own_child: [100, 500], young_relative: [100, 300] },
      baby: { close_family: [600, 2000], close_friend: [300, 1000], friend: [200, 600], colleague: [100, 500] },
      business: { partner: [600, 3000], friend: [300, 1000], employee: [100, 600] },
      graduation: { own_child: [500, 2000], young_relative: [200, 800], friend_child: [100, 500] },
      funeral: { close_family: [301, 2001], close_friend: [201, 1001], friend: [101, 501], colleague: [101, 301], acquaintance: [51, 201] }
    };
    const L = { own_child: "Your own child", young_relative: "Niece / nephew / younger relative", parents: "Parents", grandparents: "Grandparents", friend_child: "A friend's child", employee: "Employee / team member", colleague_child: "Colleague's child", service_staff: "Building / service staff", close_family: "Close family member", close_friend: "Close friend", friend: "Friend", colleague: "Colleague", acquaintance: "Acquaintance", partner: "Business partner / owner" };
    // Approximate CNY per 1 unit (edit freely). Local customs vary — HK/SG lai see are traditionally smaller.
    const FX = { CNY: 1, USD: 7.1, CAD: 5.1, AUD: 4.6, GBP: 9.3, EUR: 8.1, HKD: 0.91, SGD: 5.4, MYR: 1.6, TWD: 0.22, INR: 0.083 };
    const SYM = { CNY: "¥", USD: "$", CAD: "C$", AUD: "A$", GBP: "£", EUR: "€", HKD: "HK$", SGD: "S$", MYR: "RM", TWD: "NT$", INR: "₹" };
    const localFactor = { HKD: 0.35, SGD: 0.5, MYR: 0.5, TWD: 1, CNY: 1, USD: 0.8, CAD: 0.8, AUD: 0.8, GBP: 0.8, EUR: 0.8, INR: 1 };
    const occ = $("#hb-occ"), rel = $("#hb-rel");
    const fillRel = () => { const keys = Object.keys(R[occ.value]); rel.innerHTML = keys.map(k => `<option value="${k}">${L[k]}</option>`).join(""); };
    const luckyRound = (x, funeral) => {
      if (x < 1) x = 1;
      const mag = Math.pow(10, Math.max(0, Math.floor(Math.log10(x)) - 1));
      let cands = [];
      const pats = funeral ? [1, 3, 5, 7, 9] : [6, 8, 9, 66, 68, 88, 99, 128, 168, 188, 288, 388, 520, 588, 666, 688, 888, 999, 1088, 1288, 1314, 1688, 1888, 2688, 2888, 3888, 5888, 6666, 6888, 8888, 9999];
      if (funeral) { const r = Math.round(x / 100) * 100 + 1; return [r > 1 ? r : 51]; }
      pats.forEach(p => { for (let m = 1; m <= 100000; m *= 10) { const v = p * m; if (v >= x * 0.7 && v <= x * 1.35 && !/4/.test(String(v))) cands.push(v); } });
      [8, 6, 9].forEach(e => { const v = Math.max(e, Math.round(x / (mag * 10)) * mag * 10 - mag * 10 + e * mag); if (!/4/.test(String(v))) cands.push(v); });
      cands = [...new Set(cands)].filter(v => v > 0).sort((a, b) => Math.abs(a - x) - Math.abs(b - x));
      return cands.slice(0, 3).sort((a, b) => a - b);
    };
    const run = () => {
      const cur = $("#hb-cur").value; const close = +$("#hb-close").value; const [lo, hi] = R[occ.value][rel.value];
      const funeral = occ.value === "funeral";
      const cnyTarget = lo + (hi - lo) * (close / 100);
      const local = cnyTarget / FX[cur] * localFactor[cur];
      const opts = luckyRound(local, funeral);
      const out = $("#hb-result");
      out.innerHTML = `<div class="card"><div class="small muted">Suggested amount${opts.length > 1 ? "s" : ""}</div><div class="big-out" style="color:var(--red)">${opts.map(v => SYM[cur] + v.toLocaleString()).join(" · ")}</div>
        <p class="small muted" style="margin:6px 0 0">Typical range: ${SYM[cur]}${Math.round(lo / FX[cur] * localFactor[cur]).toLocaleString()} – ${SYM[cur]}${Math.round(hi / FX[cur] * localFactor[cur]).toLocaleString()} · approximate, local customs vary by city and family.</p></div>
        <ul style="margin-top:14px">${funeral ? "<li>Use a <b>white envelope</b> (白包) — never red — and odd amounts are customary.</li><li>Hand it over quietly with condolences.</li>" :
          "<li>Use a <b>red envelope</b> and crisp new notes; avoid coins.</li><li>Never include a <b>4</b> (40, 400, 444 …) — it sounds like 死 (death).</li><li>Even amounts are preferred; 6, 8 and 9 add meaning (smooth · prosper · lasting).</li><li>Give and receive with both hands; recipients usually don't open it in front of you.</li>"}</ul>`;
      out.classList.add("show");
    };
    occ.addEventListener("change", () => { fillRel(); run(); });
    [rel, $("#hb-cur"), $("#hb-close")].forEach(el => el.addEventListener("input", run));
    fillRel(); run();
  }

  /* ================= Zodiac finder & compatibility ================= */
  const zd = $("#tool-zodiac");
  if (zd) {
    const signOf = dateStr => {
      const [y, m, d] = dateStr.split("-").map(Number);
      const c = D.cny[y]; if (!c) return null;
      const [cm, cd] = c.split("-").map(Number);
      const zy = (m < cm || (m === cm && d < cd)) ? y - 1 : y;
      return { zy, idx: ((zy - 4) % 12 + 12) % 12, el: D.elements[zy % 10], yin: zy % 2 ? "Yin" : "Yang", early: zy !== y };
    };
    const thisYear = (() => { const t = new Date(); return signOf(`${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`); })();
    const run = () => {
      const v = $("#zd-date").value; const out = $("#zd-result");
      const r = v && signOf(v); if (!r) { out.innerHTML = '<p class="form-msg err" style="display:block">Enter a date between 1924 and 2044.</p>'; out.classList.add("show"); return; }
      const a = D.animals[r.idx];
      const friends = D.trines.find(t => t.includes(r.idx)).filter(i => i !== r.idx).map(i => D.animals[i].en);
      const secret = D.harmony.find(p => p.includes(r.idx)).find(i => i !== r.idx);
      const clashI = D.clash.find(p => p.includes(r.idx)).find(i => i !== r.idx);
      out.innerHTML = `<div class="score"><div style="font-size:4rem;line-height:1">${a.emoji}</div><div><div class="tag red">${r.el[0]} ${a.en} · ${r.el[1]}${a.cn}</div><h3 style="margin:.4em 0 .2em">You are a ${r.el[0]} ${a.en} (${r.yin})</h3><p class="muted" style="margin:0">Traits traditionally associated: ${a.traits}.${r.early ? ` <br><b>Note:</b> born before Chinese New Year ${r.zy + 1} (${U.fmt(`${r.zy + 1}-${D.cny[r.zy + 1]}`, { month: "short", day: "numeric" })}), so your sign follows ${r.zy}.` : ""}</p></div></div>
      <div class="grid g3" style="margin-top:16px"><div class="card"><div class="small muted">Best allies (三合)</div><b>${friends.join(" & ")}</b></div><div class="card"><div class="small muted">Secret friend (六合)</div><b>${D.animals[secret].en}</b></div><div class="card"><div class="small muted">Clash (六冲)</div><b>${D.animals[clashI].en}</b></div></div>
      ${thisYear && thisYear.idx === r.idx ? `<div class="callout warn" style="margin-top:14px">This is your <b>Ben Ming Nian</b> (本命年, your own zodiac year) — tradition says to wear red for protection.</div>` : ""}`;
      out.classList.add("show");
    };
    $("#zd-go").addEventListener("click", run);
    // compatibility
    const A = $("#zc-a"), B = $("#zc-b");
    const opts = D.animals.map((a, i) => `<option value="${i}">${a.emoji} ${a.en} ${a.cn}</option>`).join("");
    A.innerHTML = opts; B.innerHTML = opts; B.value = "6";
    const has = (list, x, y) => list.some(p => p.includes(x) && p.includes(y));
    const comp = () => {
      const x = +A.value, y = +B.value; let lvl, txt, sc;
      if (x === y) { lvl = "Same sign"; sc = 70; txt = "Shared values and rhythm — watch for stubborn standoffs."; }
      else if (has(D.harmony, x, y)) { lvl = "Six Harmonies (六合) — excellent"; sc = 95; txt = "A classic 'secret friend' pairing: complementary and supportive."; }
      else if (D.trines.some(t => t.includes(x) && t.includes(y))) { lvl = "Three Harmonies (三合) — very good"; sc = 88; txt = "Same trine: similar outlook and natural teamwork."; }
      else if (has(D.clash, x, y)) { lvl = "Six Clashes (六冲) — challenging"; sc = 30; txt = "Opposite signs on the zodiac wheel; needs patience and compromise."; }
      else if (has(D.harm, x, y)) { lvl = "Six Harms (六害) — tricky"; sc = 42; txt = "Traditional 'harm' pairing: misunderstandings are common."; }
      else { lvl = "Neutral"; sc = 62; txt = "No strong traditional bond or conflict — it depends on the people."; }
      $("#zc-result").innerHTML = `<div class="score"><div class="ring" style="--p:${sc};--c:${Engine.ringColor(sc)}"><b>${sc}</b></div><div><h3 style="margin:0 0 .2em">${D.animals[x].emoji} ${D.animals[x].en} + ${D.animals[y].emoji} ${D.animals[y].en}</h3><div class="tag gold">${lvl}</div><p class="muted" style="margin:.5em 0 0">${txt}</p></div></div>`;
      $("#zc-result").classList.add("show");
    };
    A.addEventListener("change", comp); B.addEventListener("change", comp); comp();
    // year table
    const tb = $("#zd-table");
    if (tb) {
      const rows = []; for (let y = 1924; y <= 2043; y++) rows.push(y);
      tb.innerHTML = `<thead><tr><th>Year</th><th>Sign</th><th>Element</th><th>Starts</th></tr></thead><tbody>${rows.map(y => { const i = ((y - 4) % 12 + 12) % 12; const e = D.elements[y % 10]; return `<tr><td>${y}</td><td>${D.animals[i].emoji} ${D.animals[i].en} ${D.animals[i].cn}</td><td>${e[0]} ${e[1]}</td><td>${U.fmt(`${y}-${D.cny[y]}`, { month: "short", day: "numeric", year: "numeric" })}</td></tr>`; }).join("")}</tbody>`;
      const f = $("#zd-filter"); if (f) { f.innerHTML = '<option value="">All signs</option>' + D.animals.map(a => `<option>${a.en}</option>`).join(""); f.addEventListener("change", () => $$("tbody tr", tb).forEach(tr => tr.hidden = f.value && !tr.children[1].textContent.includes(f.value))); }
    }
  }

  /* ================= Launch date checker ================= */
  const ld = $("#tool-date");
  if (ld) {
    const run = () => {
      const v = $("#ld-date").value; const out = $("#ld-result"); if (!v) return;
      const [y, m, d] = v.split("-");
      const a = Engine.analyze(y + m + d); const md = Engine.analyze(String(+m) + String(+d).padStart(2, "0"));
      const flags = [];
      const g = D.festivals.find(f => f.slug === "ghost-month");
      if (g.dates[+y] && v >= g.dates[+y] && v <= g.ends[+y]) flags.push(["warn", `Falls in <b>Ghost Month</b> (${U.fmt(g.dates[+y], { month: "short", day: "numeric" })} – ${U.fmt(g.ends[+y], { month: "short", day: "numeric" })}). Many Chinese-speaking customers avoid launches, weddings and moving house in this period.`]);
      const q = D.festivals.find(f => f.slug === "qingming"); if (q.dates[+y] === v) flags.push(["warn", "This is <b>Qingming</b> (Tomb-Sweeping Day) — keep promotions respectful."]);
      if (/4/.test(String(+d))) flags.push(["warn", `Day ${+d} contains a 4 — some businesses avoid the 4th, 14th and 24th.`]);
      if (/8/.test(String(+d))) flags.push(["good", `Day ${+d} contains an 8 — popular for openings and signings.`]);
      const near = U.occurrences(true).filter(o => o.f.type !== "caution").map(o => ({ o, gap: Math.round((U.parse(o.d) - U.parse(v)) / 864e5) })).filter(x => x.gap >= 0 && x.gap <= 21);
      near.forEach(x => flags.push(["good", x.gap === 0 ? `It <b>is</b> ${esc(x.o.f.name)} — maximum attention (and competition).` : `${x.gap} days before <b>${esc(x.o.f.name)}</b> — ideal warm-up window.`]));
      const wd = U.parse(v).toLocaleDateString("en-US", { weekday: "long" });
      out.innerHTML = `<div class="grid g2"><div class="card"><div class="small muted">Full date ${y}${m}${d}</div>${Engine.render(a, { label: "Date" })}</div><div class="card"><div class="small muted">Month-day code ${String(+m) + "." + (+d)}</div><div class="big-out">${+m}.${+d} <span class="small muted">· ${wd}</span></div><div class="tag ${md.score >= 70 ? "jade" : md.score >= 45 ? "gold" : "red"}">Score ${md.score} · ${md.verdict[0]}</div>
        <div style="margin-top:14px">${flags.length ? flags.map(([t, s]) => `<div class="callout ${t}" style="margin-bottom:8px">${s}</div>`).join("") : '<p class="muted">No festival or taboo conflicts detected.</p>'}</div></div></div>`;
      out.classList.add("show");
    };
    const t = new Date(); t.setDate(t.getDate() + 30);
    $("#ld-date").value = t.toISOString().slice(0, 10);
    $("#ld-go").addEventListener("click", run); $("#ld-date").addEventListener("change", run); run();
  }

  /* ================= Campaign planner ================= */
  const cp = $("#tool-planner");
  if (cp) {
    const sel = $("#cp-fest");
    const occ = U.occurrences().filter(o => o.f.type !== "caution");
    sel.innerHTML = occ.slice(0, 24).map((o, i) => `<option value="${i}">${esc(o.f.name)} — ${U.fmt(o.d, { month: "short", day: "numeric", year: "numeric" })}</option>`).join("");
    const pre = new URLSearchParams(location.search).get("f");
    if (pre) { const i = occ.findIndex(o => o.f.slug === pre); if (i >= 0) sel.value = i; }
    const M = [
      [-90, "Strategy & budget locked", "Define goals, hero products, lucky price points and channel mix (Tmall/JD/Douyin/WeChat/Xiaohongshu or diaspora channels)."],
      [-60, "Creative & partners booked", "Brief creative with festival symbolism; book KOLs/KOCs and affiliates; reserve paid media."],
      [-45, "Platform registration & pricing", "Register for platform campaigns, finalise SKUs and 4-free, 8-rich price tiers."],
      [-30, "Content seeding", "Publish explainers, gift guides and UGC prompts; start email/SMS list growth."],
      [-14, "Teasers & pre-sale", "Launch countdowns, pre-sale deposits, bundles and red-envelope coupons."],
      [-7, "Warm-up week", "Retarget engaged users, go live with influencers, stress-test checkout and inventory."],
      [-1, "Final push", "Reminder blasts, limited drops, customer-service staffing."],
      [0, "Festival day", "Peak traffic: live-stream, flash deals, real-time bid management."],
      [3, "Post-campaign", "Fulfilment, reviews, thank-you messages and lookalike audiences for the next number-day."]
    ];
    const run = () => {
      const o = occ[+sel.value]; const bud = parseFloat($("#cp-budget").value) || 0;
      const rows = M.map(([off, t, dsc]) => { const dt = U.parse(o.d); dt.setDate(dt.getDate() + off); const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`; return { off, t, dsc, iso, past: U.daysUntil(iso) < 0 }; });
      const split = [["Paid media & ads", .4], ["Influencers / KOLs", .25], ["Creative & content", .15], ["Promotions & coupons", .12], ["Contingency", .08]];
      const days = U.daysUntil(o.d);
      $("#cp-result").innerHTML = `<div class="callout ${days < 45 ? "warn" : "good"}"><b>${esc(o.f.name)}</b> is in <b>${days} days</b> (${U.fmt(o.d)}). ${days < 45 ? "You're inside the 45-day crunch — prioritise the steps still ahead." : "You have time for a full-cycle campaign."}</div>
      <div class="cal-list" style="margin-top:14px">${rows.map(r => `<div class="cal-item ${r.past ? "past" : ""}"><div class="cal-date"><span>${r.off === 0 ? "Day 0" : (r.off > 0 ? "T+" : "T") + r.off}</span><b>${U.parse(r.iso).getDate()}</b><span>${U.parse(r.iso).toLocaleDateString("en-US", { month: "short" })}</span></div><div><b>${r.t}</b><div class="small muted">${r.dsc}</div></div><div class="cal-act">${r.past ? '<span class="tag">passed</span>' : '<span class="tag jade">upcoming</span>'}</div></div>`).join("")}</div>
      ${bud > 0 ? `<h3 style="margin-top:20px">Suggested budget split</h3><div class="table-wrap"><table><tbody>${split.map(([k, p]) => `<tr><td>${k}</td><td>${Math.round(p * 100)}%</td><td><b>${Math.round(bud * p).toLocaleString()}</b></td></tr>`).join("")}</tbody></table></div>` : ""}
      <div class="share" style="margin-top:16px"><button class="btn btn-ghost btn-sm" id="cp-ics">📅 Add milestones to calendar (.ics)</button><button class="btn btn-ghost btn-sm" id="cp-copy">Copy checklist</button><a class="btn btn-primary btn-sm" href="${base}services.html?need=campaign&fest=${o.f.slug}#brief">Get an expert campaign plan →</a></div>`;
      $("#cp-ics").onclick = () => U.ics(rows.filter(r => !r.past).map(r => ({ date: r.iso, title: `${o.f.name}: ${r.t}`, desc: r.dsc })), `077088-${o.f.slug}-${o.y}-plan.ics`);
      $("#cp-copy").onclick = () => U.copy(rows.map(r => `☐ ${r.iso} — ${r.t}: ${r.dsc}`).join("\n"));
      $("#cp-result").classList.add("show");
    };
    sel.addEventListener("change", run); $("#cp-budget").addEventListener("input", run); run();
  }

  /* ================= Gift taboo checker ================= */
  const gt = $("#tool-gifts");
  if (gt) {
    const q = $("#gt-q"), list = $("#gt-list"), f = $("#gt-filter");
    const V = { avoid: ["red", "Avoid"], caution: ["gold", "Caution"], good: ["jade", "Great gift"] };
    const draw = () => {
      const s = q.value.toLowerCase().trim(), v = f.value;
      const items = D.gifts.filter(g => (!v || g.verdict === v) && (!s || (g.item + g.cn + g.pun + g.alt).toLowerCase().includes(s)));
      list.innerHTML = items.map(g => `<div class="card"><div style="display:flex;justify-content:space-between;gap:8px;align-items:start"><h3>${esc(g.item)}</h3><span class="tag ${V[g.verdict][0]}">${V[g.verdict][1]}</span></div><div class="cn" style="font-size:1.2rem;margin-bottom:6px">${g.cn}</div><p class="small">${esc(g.pun)}</p><p class="small muted" style="margin:0"><b>Instead:</b> ${esc(g.alt)}</p></div>`).join("") || '<p class="muted">No match — try “clock”, “tea” or “flowers”.</p>';
    };
    q.addEventListener("input", draw); f.addEventListener("change", draw); draw();
  }

  /* ================= Number meanings explorer ================= */
  const nm = $("#numbers-explorer");
  if (nm) {
    const q = $("#nm-q"), f = $("#nm-filter"), body = $("#nm-body");
    const rows = [
      ...Object.entries(D.digits).map(([k, v]) => ({ code: k, cn: v.cn + " · " + v.py, meaning: v.sound + " — " + v.meaning, tone: v.score >= 1 ? "good" : v.score <= -1 ? "bad" : "mixed", kind: "digit" })),
      ...D.combos.map(([code, cn, meaning, tone]) => ({ code, cn, meaning, tone, kind: "combo" }))
    ];
    const draw = () => {
      const s = q.value.toLowerCase().trim(), v = f.value;
      body.innerHTML = rows.filter(r => (!v || r.tone === v || r.kind === v) && (!s || (r.code + r.cn + r.meaning).toLowerCase().includes(s))).map(r => `<tr><td><b style="font-size:1.1rem">${r.code}</b></td><td class="cn">${esc(r.cn)}</td><td>${esc(r.meaning)}</td><td><span class="tag ${r.tone === "good" ? "jade" : r.tone === "bad" ? "red" : "gold"}">${r.tone}</span></td><td><a class="small" href="${base}tools/number-checker.html?n=${r.code}">Analyse →</a></td></tr>`).join("");
    };
    q.addEventListener("input", draw); f.addEventListener("change", draw); draw();
  }

  /* ================= Full calendar ================= */
  const cal = $("#calendar");
  if (cal) {
    let type = "all", year = "upcoming";
    const ySel = $("#cal-year"); ySel.innerHTML = '<option value="upcoming">Next 12 months</option>' + D.years.map(y => `<option>${y}</option>`).join("");
    const draw = () => {
      let occ = U.occurrences(true);
      if (year === "upcoming") occ = occ.filter(o => { const n = U.daysUntil(o.d); return n >= -1 && n <= 366; });
      else occ = occ.filter(o => o.y === +year);
      if (type !== "all") occ = occ.filter(o => o.f.type === type);
      cal.innerHTML = occ.map(o => {
        const dt = U.parse(o.d); const n = U.daysUntil(o.d); const page = o.f.page === null ? null : (o.f.page || o.f.slug);
        const ends = o.f.ends && o.f.ends[o.y] ? ` – ${U.fmt(o.f.ends[o.y], { month: "short", day: "numeric" })}` : "";
        return `<div class="cal-item ${n < 0 ? "past" : ""} ${o.f.type === "caution" ? "caution" : ""}"><div class="cal-date"><span>${dt.toLocaleDateString("en-US", { month: "short" })}</span><b>${dt.getDate()}</b><span>${dt.getFullYear()}</span></div>
        <div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><b>${page ? `<a href="${base}festivals/${page}.html">${esc(o.f.name)}</a>` : esc(o.f.name)}</b><span class="cn muted">${o.f.cn}</span><span class="tag ${o.f.type === "shopping" ? "red" : o.f.type === "caution" ? "gold" : "jade"}">${o.f.type}</span></div><div class="small muted">${esc(o.f.blurb)} ${dt.toLocaleDateString("en-US", { weekday: "long" })}${ends}${n >= 0 ? ` · <b>${n === 0 ? "today" : n + " days to go"}</b>` : ""}</div></div>
        <div class="cal-act"><button class="btn btn-ghost btn-sm" data-ics="${o.f.slug}|${o.d}">+ Calendar</button></div></div>`;
      }).join("") || '<p class="muted">Nothing in this view.</p>';
      $$("[data-ics]", cal).forEach(b => b.addEventListener("click", () => { const [s, d] = b.getAttribute("data-ics").split("|"); const f = D.festivals.find(x => x.slug === s); U.ics([{ date: d, title: f.name + " (" + f.cn + ")", desc: f.blurb }], `${s}-${d}.ics`); }));
    };
    $$("[data-cal-type]").forEach(b => b.addEventListener("click", () => { type = b.getAttribute("data-cal-type"); $$("[data-cal-type]").forEach(x => x.classList.toggle("btn-primary", x === b)); $$("[data-cal-type]").forEach(x => x.classList.toggle("btn-ghost", x !== b)); draw(); }));
    ySel.addEventListener("change", () => { year = ySel.value; draw(); });
    $("#cal-all-ics").addEventListener("click", () => U.ics(U.occurrences().filter(o => o.f.type !== "caution").map(o => ({ date: o.d, title: `${o.f.name} (${o.f.cn})`, desc: o.f.blurb })), "077088-china-number-day-calendar.ics"));
    draw();
  }

  /* ================= Festival page: next date + table ================= */
  $$("[data-fest-dates]").forEach(el => {
    const f = D.festivals.find(x => x.slug === el.getAttribute("data-fest-dates")); if (!f) return;
    el.innerHTML = `<thead><tr><th>Year</th><th>Date</th><th>Weekday</th><th></th></tr></thead><tbody>${Object.entries(f.dates).map(([y, d]) => { const n = U.daysUntil(d); return `<tr><td>${y}</td><td><b>${U.fmt(d, { month: "long", day: "numeric" })}${f.ends ? " – " + U.fmt(f.ends[y], { month: "long", day: "numeric" }) : ""}</b></td><td>${U.parse(d).toLocaleDateString("en-US", { weekday: "long" })}</td><td>${n < 0 ? '<span class="tag">past</span>' : `<span class="tag jade">in ${n} days</span>`}</td></tr>`; }).join("")}</tbody>`;
  });
  $$("[data-fest-next]").forEach(el => {
    const o = U.nextOf(el.getAttribute("data-fest-next"));
    if (o) el.innerHTML = `Next: <b>${U.fmt(o.d, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</b> · ${U.daysUntil(o.d)} days to go`;
  });
  $$("[data-fest-ics]").forEach(b => b.addEventListener("click", () => {
    const f = D.festivals.find(x => x.slug === b.getAttribute("data-fest-ics"));
    U.ics(Object.entries(f.dates).filter(([, d]) => U.daysUntil(d) >= 0).map(([, d]) => ({ date: d, title: `${f.name} (${f.cn})`, desc: f.blurb })), `${f.slug}.ics`);
  }));

  /* ================= Video gallery ================= */
  const vg = $("#video-gallery");
  if (vg) {
    const draw = tag => { vg.innerHTML = D.videos.filter(v => !tag || v.tag === tag).map(v => `<div><div class="yt" data-id="${v.id}" data-title="${esc(v.t)}"></div><div class="vid-title">${esc(v.t)}</div><div class="small muted">${esc(v.c)} · YouTube</div></div>`).join("");
      $$(".yt", vg).forEach(el => { const id = el.getAttribute("data-id"); el.innerHTML = '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg"><div class="play"><i></i></div>'; el.addEventListener("click", () => { el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Video"></iframe>'; }); }); };
    $$("[data-vtag]").forEach(b => b.addEventListener("click", () => { $$("[data-vtag]").forEach(x => { x.classList.toggle("btn-primary", x === b); x.classList.toggle("btn-ghost", x !== b); }); draw(b.getAttribute("data-vtag")); }));
    draw("");
  }

  /* ================= Donation form helpers ================= */
  $$(".amounts input[name=amount]").forEach(r => r.addEventListener("change", () => { const c = $("#custom-amount"); if (c) c.hidden = r.value !== "custom"; }));

  /* ================= Services form: prefill from query ================= */
  const qs = new URLSearchParams(location.search);
  if (qs.get("need")) $$(`input[name="needs"][value="${qs.get("need")}"]`).forEach(i => i.checked = true);
  if (qs.get("fest") && $("#brief-fest")) { const f = D.festivals.find(x => x.slug === qs.get("fest")); if (f) $("#brief-fest").value = f.name; }
  if (qs.get("plan") && $("#ad-package")) $("#ad-package").value = qs.get("plan");
  if (qs.get("role") && $("#job-role")) $("#job-role").value = qs.get("role");
  if (qs.get("tier") && $("#sponsor-tier")) $("#sponsor-tier").value = qs.get("tier");
})();
