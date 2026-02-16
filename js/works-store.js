// 施工実績データストア (JSON file + localStorage fallback)
const WORKS_KEY = 'demo_works';

const SEED_WORKS = [
  {
    id: '1',
    title: 'A様邸 新築工事',
    description: '木造2階建て・延床面積120㎡。耐震等級3の高性能住宅。無垢材をふんだんに使用した温かみのある仕上がりです。',
    category: '新築住宅',
    location: '富士市松岡',
    image: 'images/works-house1.jpg',
    status: 'published',
    createdAt: '2026-01-20T09:00:00',
    updatedAt: '2026-01-20T09:00:00',
  },
  {
    id: '2',
    title: 'B様邸 キッチン・浴室リフォーム',
    description: 'システムキッチン交換と浴室のユニットバス化。築30年の住宅を快適な水回りに一新しました。',
    category: 'リフォーム',
    location: '富士宮市',
    image: 'images/works-reform1.jpg',
    status: 'published',
    createdAt: '2025-11-15T09:00:00',
    updatedAt: '2025-11-15T09:00:00',
  },
  {
    id: '3',
    title: '市道○○線 道路改良工事',
    description: '延長200m・舗装改良および側溝整備。地域住民の生活道路の安全性を向上させました。',
    category: '公共工事',
    location: '富士市',
    image: 'images/works-civil1.jpg',
    status: 'published',
    createdAt: '2025-09-10T09:00:00',
    updatedAt: '2025-09-10T09:00:00',
  },
];

const WorksStore = {
  _cache: null,

  async init() {
    try {
      const res = await fetch('data/works.json');
      if (res.ok) {
        this._cache = await res.json();
        return;
      }
    } catch (e) { /* fetch失敗時はlocalStorageフォールバック */ }
    this._cache = null;
  },

  _getAll() {
    if (this._cache) return [...this._cache];
    const raw = localStorage.getItem(WORKS_KEY);
    if (!raw) {
      localStorage.setItem(WORKS_KEY, JSON.stringify(SEED_WORKS));
      return [...SEED_WORKS];
    }
    return JSON.parse(raw);
  },

  getPublished() {
    return this._getAll()
      .filter(w => w.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getAll() {
    return this._getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById(id) {
    return this._getAll().find(w => w.id === id) || null;
  },

  save(item) {
    const all = this._getAll();
    const now = new Date().toISOString();
    if (item.id) {
      const idx = all.findIndex(w => w.id === item.id);
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
    localStorage.setItem(WORKS_KEY, JSON.stringify(all));
    return item;
  },

  delete(id) {
    const all = this._getAll().filter(w => w.id !== id);
    localStorage.setItem(WORKS_KEY, JSON.stringify(all));
  },
};

if (typeof module !== 'undefined') module.exports = WorksStore;
