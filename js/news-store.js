// お知らせデータストア (JSON file + localStorage fallback)
const NEWS_KEY = 'demo_news';

const SEED_NEWS = [
  {
    id: '1',
    title: 'ホームページをリニューアルしました',
    body: '<p>この度、弊社ホームページをリニューアルいたしました。</p><p>より見やすく、情報をお届けできるよう改善しました。今後ともどうぞよろしくお願いいたします。</p>',
    category: 'お知らせ',
    status: 'published',
    createdAt: '2026-02-10T09:00:00',
    updatedAt: '2026-02-10T09:00:00',
  },
  {
    id: '2',
    title: '年末年始休業のお知らせ',
    body: '<p>誠に勝手ながら、下記の期間を年末年始休業とさせていただきます。</p><p><strong>休業期間：2025年12月29日（月）〜 2026年1月5日（月）</strong></p><p>1月6日（火）より通常営業いたします。ご不便をおかけいたしますが、何卒よろしくお願い申し上げます。</p>',
    category: 'お知らせ',
    status: 'published',
    createdAt: '2026-01-15T09:00:00',
    updatedAt: '2026-01-15T09:00:00',
  },
  {
    id: '3',
    title: '現場監督を募集しています',
    body: '<p>業務拡大に伴い、現場監督スタッフを募集しております。</p><p>【応募条件】<br>・普通自動車免許<br>・建築施工管理技士2級以上（優遇）<br>・経験3年以上</p><p>詳しくはお電話（0545-00-0000）にてお問い合わせください。</p>',
    category: '採用',
    status: 'published',
    createdAt: '2025-12-01T09:00:00',
    updatedAt: '2025-12-01T09:00:00',
  },
];

const NewsStore = {
  _cache: null,

  async init() {
    try {
      const res = await fetch('data/news.json');
      if (res.ok) {
        this._cache = await res.json();
        return;
      }
    } catch (e) { /* fetch失敗時はlocalStorageフォールバック */ }
    this._cache = null;
  },

  _getAll() {
    if (this._cache) return [...this._cache];
    const raw = localStorage.getItem(NEWS_KEY);
    if (!raw) {
      localStorage.setItem(NEWS_KEY, JSON.stringify(SEED_NEWS));
      return [...SEED_NEWS];
    }
    return JSON.parse(raw);
  },

  getPublished() {
    return this._getAll()
      .filter(n => n.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getAll() {
    return this._getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById(id) {
    return this._getAll().find(n => n.id === id) || null;
  },

  save(item) {
    const all = this._getAll();
    const now = new Date().toISOString();
    if (item.id) {
      const idx = all.findIndex(n => n.id === item.id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...item, updatedAt: now };
      }
    } else {
      item.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      item.createdAt = now;
      item.updatedAt = now;
      item.status = item.status || 'published';
      all.push(item);
    }
    localStorage.setItem(NEWS_KEY, JSON.stringify(all));
    return item;
  },

  delete(id) {
    const all = this._getAll().filter(n => n.id !== id);
    localStorage.setItem(NEWS_KEY, JSON.stringify(all));
  },
};

if (typeof module !== 'undefined') module.exports = NewsStore;
