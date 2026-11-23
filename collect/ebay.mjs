import { deal, pick, sleep, text } from './lib.mjs';

const PAGES = [['/globaldeals', null], ['/globaldeals/tech', 'Tech'], ['/globaldeals/home', 'Home'], ['/globaldeals/fashion', 'Fashion']];

/** eBay's public deals pages: fixed-price listings shown with a previous price and the listing's own picture. */
export async function collectEbay({ minPct = 25, n = 15 }) {
  const cards = [];
  for (const [path, pageCat] of PAGES) {
    const html = await text('https://www.ebay.com' + path);
    const tiles = html.split(/<div[^>]*class="dne-itemtile dne-itemtile-[^"]*"/).slice(1);
    if (process.env.DEBUG_EBAY) {
      const i = html.indexOf('dne-itemtile');
      const j = html.indexOf('dne-itemtile-price'); console.error(`ebay ${path}: size ${html.length}, tiles ${tiles.length}, price markers ${(html.match(/dne-itemtile-price/g) || []).length}, strike ${(html.match(/itemtile-price-strikethrough/g) || []).length}, name props ${(html.match(/itemprop="?name/g) || []).length}; first price block: ${JSON.stringify(html.slice(Math.max(0, j - 300), j + 500))}`);
    }
    for (const tile of tiles) {
      const link = /href="?(https:\/\/www\.ebay\.com\/itm\/\d+)/.exec(tile);
      const title = /itemprop="?name"?[^>]*>([^<]+)</.exec(tile);
      const price = /itemprop="?price"?[^>]*>(?:US\s)?\$\s?([\d,]+\.\d{2})/.exec(tile);
      const old = /itemtile-price-strikethrough[^>]*>(?:US\s)?\$\s?([\d,]+\.\d{2})/.exec(tile);
      if (!link || !title || !price || !old) continue;
      const picture = /(?:data-config-src|src)="?(https:\/\/i\.ebayimg\.com\/images\/g\/[^\/"\s>]+\/s-l\d+\.(?:jpe?g|png|webp))/.exec(tile);
      const d = deal('eBay', 'ebay', title[1], link[1], Number(price[1].replace(/,/g, '')), Number(old[1].replace(/,/g, '')), picture ? { image_url: picture[1] } : {});
      if (d) { if (d.category === 'Other' && pageCat) d.category = pageCat; if (d.pct >= minPct) cards.push(d); }
    }
    await sleep(1500);
  }
  return pick(cards, n, Math.max(4, Math.ceil(n / 4)));
}
