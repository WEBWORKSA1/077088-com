/* 077088.com — shared data. Lunar-festival dates computed with the lunardate library
   (Chinese lunisolar calendar); Qingming from the solar term (sun at 15° longitude). */
window.D = (function () {
  const Y = [2026, 2027, 2028, 2029, 2030];
  const fixed = (m, d) => Object.fromEntries(Y.map(y => [y, `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`]));

  const festivals = [
    { slug: "chinese-new-year", name: "Chinese New Year (Spring Festival)", cn: "春节", type: "culture", star: true,
      dates: { 2026: "2026-02-17", 2027: "2027-02-06", 2028: "2028-01-26", 2029: "2029-02-13", 2030: "2030-02-03" },
      blurb: "The biggest gifting, travel and red-envelope season of the year." },
    { slug: "valentines-day", name: "Valentine's Day", cn: "情人节", type: "shopping", dates: fixed(2, 14),
      blurb: "Western Valentine's is widely celebrated by younger urban consumers.", page: null },
    { slug: "lantern-festival", name: "Lantern Festival", cn: "元宵节", type: "culture",
      dates: { 2026: "2026-03-03", 2027: "2027-02-20", 2028: "2028-02-09", 2029: "2029-02-27", 2030: "2030-02-17" },
      blurb: "Closes the New Year period; lanterns, riddles and tangyuan." },
    { slug: "queens-day-38", name: "3.8 Queen's / Goddess Day", cn: "三八妇女节 · 女王节", type: "shopping", dates: fixed(3, 8),
      blurb: "International Women's Day, rebranded by e-commerce as a beauty & self-care sale." },
    { slug: "qingming", name: "Qingming (Tomb-Sweeping Day)", cn: "清明节", type: "caution",
      dates: { 2026: "2026-04-05", 2027: "2027-04-05", 2028: "2028-04-04", 2029: "2029-04-04", 2030: "2030-04-05" },
      blurb: "A day to honour ancestors — keep promotions respectful and low-key." },
    { slug: "520", name: "520 Internet Valentine's Day", cn: "520 · 我爱你", type: "shopping", star: true, dates: fixed(5, 20),
      blurb: "5-2-0 sounds like 我爱你 (I love you) — a digital-native love-gifting day." },
    { slug: "618", name: "618 Mid-Year Shopping Festival", cn: "618 年中大促", type: "shopping", star: true, dates: fixed(6, 18),
      blurb: "China's second-biggest online sale, born from JD.com's founding anniversary." },
    { slug: "dragon-boat", name: "Dragon Boat Festival", cn: "端午节", type: "culture",
      dates: { 2026: "2026-06-19", 2027: "2027-06-09", 2028: "2028-05-28", 2029: "2029-06-16", 2030: "2030-06-05" },
      blurb: "Zongzi, dragon-boat races and premium gift boxes." },
    { slug: "ghost-month", name: "Ghost Month begins (7th lunar month)", cn: "鬼月 · 农历七月", type: "caution",
      dates: { 2026: "2026-08-13", 2027: "2027-08-02", 2028: "2028-08-20", 2029: "2029-08-10", 2030: "2030-07-30" },
      ends: { 2026: "2026-09-10", 2027: "2027-08-31", 2028: "2028-09-18", 2029: "2029-09-07", 2030: "2030-08-28" },
      blurb: "Traditionally avoided for weddings, moving house and big launches.", page: "ghost-month" },
    { slug: "qixi", name: "Qixi — Chinese Valentine's Day (7·7)", cn: "七夕节", type: "culture", star: true,
      dates: { 2026: "2026-08-19", 2027: "2027-08-08", 2028: "2028-08-26", 2029: "2029-08-16", 2030: "2030-08-05" },
      blurb: "7th day of the 7th lunar month — the '077' in 077088. Jewellery, flowers, luxury." },
    { slug: "88-festival", name: "8·8 Father's Day (Taiwan) & 8.8 Sales", cn: "八八节 · 爸爸节", type: "shopping", star: true, dates: fixed(8, 8),
      blurb: "八八 (bā bā) sounds like 爸爸 (bàba, dad) — the '088' in 077088." },
    { slug: "teachers-day", name: "Teachers' Day", cn: "教师节", type: "culture", dates: fixed(9, 10),
      blurb: "Thank-you gifts for teachers in mainland China.", page: null },
    { slug: "mid-autumn", name: "Mid-Autumn Festival", cn: "中秋节", type: "culture", star: true,
      dates: { 2026: "2026-09-25", 2027: "2027-09-15", 2028: "2028-10-03", 2029: "2029-09-22", 2030: "2030-09-12" },
      blurb: "Mooncakes, family reunions and corporate gift boxes." },
    { slug: "national-day", name: "National Day Golden Week", cn: "国庆黄金周", type: "culture", dates: fixed(10, 1),
      blurb: "A week-long holiday (Oct 1–7): travel, retail and dining peaks." },
    { slug: "double-ninth", name: "Double Ninth (Chongyang) Festival", cn: "重阳节", type: "culture",
      dates: { 2026: "2026-10-18", 2027: "2027-10-08", 2028: "2028-10-26", 2029: "2029-10-16", 2030: "2030-10-05" },
      blurb: "九九 (jiǔ jiǔ) sounds like 久久, 'long-lasting' — a day to honour elders." },
    { slug: "singles-day", name: "11.11 Singles' Day", cn: "双十一", type: "shopping", star: true, dates: fixed(11, 11),
      blurb: "The world's largest online shopping festival; pre-sales start in October." },
    { slug: "double-12", name: "12.12 Double Twelve", cn: "双十二", type: "shopping", dates: fixed(12, 12),
      blurb: "Year-end sale; a second chance after 11.11." }
  ];

  // Chinese New Year dates 1924–2044 (for zodiac boundaries)
  const cny = {1924:"02-05",1925:"01-24",1926:"02-13",1927:"02-02",1928:"01-23",1929:"02-10",1930:"01-30",1931:"02-17",1932:"02-06",1933:"01-26",1934:"02-14",1935:"02-04",1936:"01-24",1937:"02-11",1938:"01-31",1939:"02-19",1940:"02-08",1941:"01-27",1942:"02-15",1943:"02-05",1944:"01-25",1945:"02-13",1946:"02-02",1947:"01-22",1948:"02-10",1949:"01-29",1950:"02-17",1951:"02-06",1952:"01-27",1953:"02-14",1954:"02-03",1955:"01-24",1956:"02-12",1957:"01-31",1958:"02-18",1959:"02-08",1960:"01-28",1961:"02-15",1962:"02-05",1963:"01-25",1964:"02-13",1965:"02-02",1966:"01-21",1967:"02-09",1968:"01-30",1969:"02-17",1970:"02-06",1971:"01-27",1972:"02-15",1973:"02-03",1974:"01-23",1975:"02-11",1976:"01-31",1977:"02-18",1978:"02-07",1979:"01-28",1980:"02-16",1981:"02-05",1982:"01-25",1983:"02-13",1984:"02-02",1985:"02-20",1986:"02-09",1987:"01-29",1988:"02-17",1989:"02-06",1990:"01-27",1991:"02-15",1992:"02-04",1993:"01-23",1994:"02-10",1995:"01-31",1996:"02-19",1997:"02-07",1998:"01-28",1999:"02-16",2000:"02-05",2001:"01-24",2002:"02-12",2003:"02-01",2004:"01-22",2005:"02-09",2006:"01-29",2007:"02-18",2008:"02-07",2009:"01-26",2010:"02-14",2011:"02-03",2012:"01-23",2013:"02-10",2014:"01-31",2015:"02-19",2016:"02-08",2017:"01-28",2018:"02-16",2019:"02-05",2020:"01-25",2021:"02-12",2022:"02-01",2023:"01-22",2024:"02-10",2025:"01-29",2026:"02-17",2027:"02-06",2028:"01-26",2029:"02-13",2030:"02-03",2031:"01-23",2032:"02-11",2033:"01-31",2034:"02-19",2035:"02-08",2036:"01-28",2037:"02-15",2038:"02-04",2039:"01-24",2040:"02-12",2041:"02-01",2042:"01-22",2043:"02-10",2044:"01-30"};

  const animals = [
    { en: "Rat", cn: "鼠", emoji: "🐀", traits: "quick-witted, resourceful, adaptable" },
    { en: "Ox", cn: "牛", emoji: "🐂", traits: "diligent, dependable, determined" },
    { en: "Tiger", cn: "虎", emoji: "🐅", traits: "brave, competitive, confident" },
    { en: "Rabbit", cn: "兔", emoji: "🐇", traits: "gentle, elegant, responsible" },
    { en: "Dragon", cn: "龙", emoji: "🐉", traits: "ambitious, energetic, charismatic" },
    { en: "Snake", cn: "蛇", emoji: "🐍", traits: "wise, intuitive, composed" },
    { en: "Horse", cn: "马", emoji: "🐎", traits: "active, independent, warm-hearted" },
    { en: "Goat", cn: "羊", emoji: "🐐", traits: "calm, creative, kind" },
    { en: "Monkey", cn: "猴", emoji: "🐒", traits: "clever, curious, playful" },
    { en: "Rooster", cn: "鸡", emoji: "🐓", traits: "observant, hardworking, honest" },
    { en: "Dog", cn: "狗", emoji: "🐕", traits: "loyal, sincere, protective" },
    { en: "Pig", cn: "猪", emoji: "🐖", traits: "generous, easy-going, sincere" }
  ];
  const elements = [["Metal", "金"], ["Metal", "金"], ["Water", "水"], ["Water", "水"], ["Wood", "木"], ["Wood", "木"], ["Fire", "火"], ["Fire", "火"], ["Earth", "土"], ["Earth", "土"]];
  const trines = [[0, 4, 8], [1, 5, 9], [2, 6, 10], [3, 7, 11]];
  const harmony = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
  const clash = [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]];
  const harm = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];

  // Digits — meaning in business & everyday Chinese number culture. score: -2 (avoid) … +2 (very lucky)
  const digits = {
    "0": { py: "líng", cn: "零", sound: "零 (zero) / 灵 líng (clever, spirited) by some readings", meaning: "Wholeness, a fresh start; on its own it can also read as 'nothing' — neutral in most uses.", score: 0 },
    "1": { py: "yī / yāo", cn: "一", sound: "一 (one, first)", meaning: "Being first, unity. Read 'yāo' in phone numbers. Can suggest 'alone' (11.11 Singles' Day).", score: 0.5 },
    "2": { py: "èr / liǎng", cn: "二", sound: "双 shuāng (pair) by association", meaning: "'Good things come in pairs' — harmony and balance.", score: 1 },
    "3": { py: "sān", cn: "三", sound: "生 shēng (life, birth) · also 散 sàn (scatter)", meaning: "Mixed: 'life/growth' in Cantonese-influenced reading, 'scatter' in some pairings.", score: 0.5 },
    "4": { py: "sì", cn: "四", sound: "死 sǐ (death)", meaning: "The most-avoided digit. Buildings skip 4th floors; prices and plates avoid it.", score: -2 },
    "5": { py: "wǔ", cn: "五", sound: "我 wǒ (I/me) · 五行 Five Elements · 无 wú (without)", meaning: "Neutral; reads as 'I/me' in slang (520 = I love you) and as 'without' in some combos.", score: 0 },
    "6": { py: "liù", cn: "六", sound: "流 / 溜 liú / liū (flow, smooth)", meaning: "Smooth progress; 六六大顺 'everything goes smoothly'. 666 = 'awesome' online.", score: 1.5 },
    "7": { py: "qī", cn: "七", sound: "齐 qí (together, complete) · 起 qǐ (rise) · 妻 qī (wife)", meaning: "Togetherness and love (Qixi, the 7th of the 7th month). Some avoid it because the 7th lunar month is Ghost Month.", score: 0.5 },
    "8": { py: "bā", cn: "八", sound: "发 fā (prosper, get rich)", meaning: "The luckiest digit — prosperity and wealth. The Beijing Olympics opened 08-08-08 at 8:08 pm.", score: 2 },
    "9": { py: "jiǔ", cn: "九", sound: "久 jiǔ (long-lasting)", meaning: "Longevity and eternity; linked to the emperor and to weddings (99 roses).", score: 1.5 }
  };

  // Combinations. tone: good | bad | mixed | slang
  const combos = [
    ["8888", "发发发发", "Prosperity × 4 — the classic premium phone-number ending", "good", 4],
    ["1688", "一路发发", "'Prosper all the way, twice' — favourite shop & phone ending", "good", 3.5],
    ["6868", "路发路发", "'Smooth road to wealth' (Cantonese-influenced reading)", "good", 3],
    ["5201314", "我爱你一生一世", "I love you for a lifetime", "slang", 3],
    ["1314520", "一生一世我爱你", "For my whole life, I love you", "slang", 3],
    ["9999", "久久久久", "Everlasting × 4", "good", 3],
    ["7456", "气死我了", "'You're driving me mad' (internet slang)", "bad", -2],
    ["1314", "一生一世", "For a lifetime, forever", "slang", 2.5],
    ["3344", "生生世世", "Forever and ever (love slang) — contains 44, so avoid in prices", "mixed", 0],
    ["9420", "就是爱你", "It's you I love", "slang", 2],
    ["9413", "九死一生", "A narrow escape — 'nine deaths, one life'", "bad", -2],
    ["1366", "一生溜溜", "A smooth life", "good", 2],
    ["888", "发发发", "Triple prosperity — top gift & price amount", "good", 3],
    ["666", "溜溜溜", "Smooth / awesome — also 'you're skilled!' online", "good", 2.5],
    ["999", "久久久", "Everlasting — popular for weddings", "good", 2.5],
    ["168", "一路发", "Prosperity all the way — the classic business number", "good", 3],
    ["518", "我要发", "Commonly read as 'I will prosper'", "good", 2],
    ["520", "我爱你", "I love you — May 20 is Internet Valentine's Day", "slang", 2],
    ["521", "我愿意 / 我爱你", "I'm willing / I love you", "slang", 1.5],
    ["530", "我想你", "I miss you", "slang", 1],
    ["250", "二百五", "Fool, idiot — never price at 250", "bad", -2.5],
    ["748", "去死吧", "'Go to hell' online (some older readings: 七世发)", "bad", -2],
    ["995", "救救我", "Help me", "bad", -1],
    ["918", "加油吧", "Go for it! Good luck!", "good", 1],
    ["996", "996 工作制", "9am–9pm, 6 days a week work culture", "mixed", -0.5],
    ["886", "拜拜了", "Bye then", "slang", 0],
    ["233", "哈哈哈", "LOL (from a forum emoji code)", "slang", 0],
    ["555", "呜呜呜", "Crying / boo-hoo", "slang", -0.5],
    ["484", "是不是", "Is it or not? Right?", "slang", -1],
    ["007", "007 工作制", "Always on call, 24/7", "mixed", -0.5],
    ["88", "发发 / 拜拜 / 爸爸", "Double prosperity · 'bye-bye' online · 'dad' (8·8 Father's Day)", "good", 2],
    ["68", "路发", "Road to prosperity", "good", 1.5],
    ["58", "我发", "I prosper", "good", 1],
    ["98", "久发", "Lasting prosperity", "good", 1.5],
    ["99", "久久", "Everlasting", "good", 1.5],
    ["66", "六六大顺", "Everything goes smoothly", "good", 1.5],
    ["77", "七七 · 齐齐", "7·7 — the Qixi date; read by some as 齐齐 'all together'", "good", 0.5],
    ["94", "就是", "Exactly (slang) — ends in 4, avoid in prices", "slang", -0.5],
    ["56", "无聊", "Bored (slang)", "slang", -0.3],
    ["38", "三八", "Women's Day (3.8) — but '三八' is also an insult for a nosy woman", "mixed", -0.5],
    ["14", "要死 / 实死", "Sounds like 'going to die' — avoid", "bad", -1.5],
    ["74", "气死 / 去死", "'Angry to death' / 'go die' — avoid", "bad", -1.5],
    ["44", "死死", "Double death — the worst pair", "bad", -2]
  ];

  const gifts = [
    { item: "Clock (desk or wall)", cn: "送钟", pun: "送钟 sòng zhōng sounds like 送终 sòng zhōng — attending someone's death", verdict: "avoid", alt: "A premium watch for a partner is usually fine; for elders and business contacts choose tea or a fruit basket." },
    { item: "Umbrella", cn: "伞", pun: "伞 sǎn sounds like 散 sàn — to break up / scatter", verdict: "avoid", alt: "Lend one if it rains; don't gift it — especially to couples." },
    { item: "Pears (to share)", cn: "梨", pun: "分梨 fēn lí sounds like 分离 — separation", verdict: "caution", alt: "Oranges and tangerines (橘 jú ~ 吉 jí, luck) are a classic safe choice." },
    { item: "Shoes", cn: "鞋", pun: "鞋 xié sounds like 邪 xié (evil); also 'walking away' from the relationship", verdict: "caution", alt: "Fine between close family or partners in many regions; avoid for business." },
    { item: "Knives or scissors", cn: "刀 / 剪", pun: "Symbolise cutting ties", verdict: "avoid", alt: "If gifting cookware, ask for a symbolic coin in return — a common workaround." },
    { item: "Green hat", cn: "绿帽子", pun: "戴绿帽 means a man's partner is unfaithful", verdict: "avoid", alt: "Choose any other colour — red or gold for festivals." },
    { item: "White or yellow chrysanthemums", cn: "菊花", pun: "Funeral flowers in Chinese culture", verdict: "avoid", alt: "Peonies, orchids or red roses (for romance)." },
    { item: "Anything in sets of four", cn: "四件套", pun: "4 sì ~ 死 sǐ (death)", verdict: "avoid", alt: "Sets of 2, 6, 8 or 9 carry positive meanings." },
    { item: "Handkerchief", cn: "手帕", pun: "Associated with tears and farewells", verdict: "caution", alt: "A silk scarf is a safer, premium alternative." },
    { item: "Mirror", cn: "镜子", pun: "Easily broken — can suggest bad luck; also used in feng shui to repel", verdict: "caution", alt: "Choose jewellery boxes or decorative art." },
    { item: "Red envelope with an amount containing 4", cn: "红包 · 4", pun: "4 ~ death; avoid 40, 400, 444", verdict: "avoid", alt: "Use 6, 8, 9 amounts: 66, 88, 168, 888." },
    { item: "Tea (premium)", cn: "茶叶", pun: "Respect and good health", verdict: "good", alt: "A top gift for elders and business partners." },
    { item: "Fruit basket (oranges / apples)", cn: "水果篮", pun: "苹果 píng guǒ ~ 平安 píng'ān (peace); 橘 ~ 吉 (luck)", verdict: "good", alt: "Ideal for Chinese New Year and hospital visits." },
    { item: "Mooncakes (Mid-Autumn)", cn: "月饼", pun: "Round = reunion (团圆)", verdict: "good", alt: "The standard corporate gift in September/October." },
    { item: "Wine or baijiu", cn: "酒", pun: "酒 jiǔ ~ 久 jiǔ (long-lasting)", verdict: "good", alt: "Gift in pairs (两瓶) for extra goodwill." },
    { item: "Gold jewellery", cn: "金饰", pun: "Wealth and blessing", verdict: "good", alt: "Top choice for Qixi, weddings and 'full-month' baby gifts." }
  ];

  const videos = [
    { id: "sr673iAqLZY", t: "MEANINGS behind Chinese NUMBERS | What numbers are lucky in Chinese?", c: "Chinese with Christine", tag: "numbers" },
    { id: "pT52hREAf18", t: "Chinese Lucky Numbers", c: "Numberphile", tag: "numbers" },
    { id: "wf13M4MoHS4", t: "Chinese Lucky and Unlucky Numbers Explained", c: "Learn Chinese Now", tag: "numbers" },
    { id: "jxKWegGb-3I", t: "Chinese Lucky Numbers And Meanings", c: "Ziggy Natural", tag: "numbers" },
    { id: "QwvlAbisiRc", t: "Most Lucky and Unlucky Numbers for Chinese People", c: "Off the Great Wall", tag: "numbers" },
    { id: "bJag2BvLnBY", t: "The Great Race | Story of the Chinese Zodiac", c: "Mythology Unleashed", tag: "zodiac" },
    { id: "ZIQCmeOIn3I", t: "The Great Race: The Story of the 12 Chinese Zodiac Animals", c: "Shop TV Philippines", tag: "zodiac" },
    { id: "vDVlZ6sQ2Jo", t: "Hongbao: Everything You Need to Know About Chinese Red Envelopes", c: "China Market Advisor", tag: "hongbao" },
    { id: "JgrZiQPO3_E", t: "The Hongbao Explained | Chinese Red Envelope", c: "Chinese Civilization Channel", tag: "hongbao" },
    { id: "7jZFekOzXz4", t: "Learn Chinese New Year Custom - Red Envelope Culture in China", c: "Learn Chinese - Hanbridge Mandarin", tag: "hongbao" }
  ];

  return { years: Y, festivals, cny, animals, elements, trines, harmony, clash, harm, digits, combos, gifts, videos };
})();
