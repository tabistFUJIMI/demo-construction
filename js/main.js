// メインJS: スクロールアニメーション、ヘッダー制御、動的コンテンツ
document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll Header ---
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('header--scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // --- Mobile Menu ---
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-open');
      nav.classList.toggle('is-open');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('is-open');
        nav.classList.remove('is-open');
      });
    });
  }

  // --- Scroll Reveal ---
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // --- Dynamic News (Top page) ---
  const newsList = document.getElementById('news-list');
  if (newsList && typeof NewsStore !== 'undefined') {
    const news = NewsStore.getPublished().slice(0, 5);
    newsList.innerHTML = news.map(n => {
      const date = new Date(n.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
      const tagClass = n.category === '採用' ? 'tag-recruit' : n.category === 'イベント' ? 'tag-event' : 'tag-info';
      return `<li>
        <a href="news.html?id=${n.id}">
          <span class="news-date">${date}</span>
          <span class="news-tag ${tagClass}">${n.category}</span>
          <span class="news-text">${n.title}</span>
        </a>
      </li>`;
    }).join('');
  }

  // --- Dynamic Services (Top page) ---
  const serviceGrid = document.getElementById('service-grid');
  if (serviceGrid && typeof ServicesStore !== 'undefined') {
    const services = ServicesStore.getAll();
    serviceGrid.innerHTML = services.map(s => `
      <a href="services.html#service-${s.id}" class="service-card reveal" data-delay="0">
        <div class="service-card-img">
          <img src="${s.image}" alt="${s.title}" loading="lazy">
        </div>
        <div class="service-card-body">
          <h3>${s.title}</h3>
          <p>${s.summary}</p>
        </div>
      </a>
    `).join('');
    // Re-observe new reveals
    serviceGrid.querySelectorAll('.reveal').forEach(el => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.1 });
      obs.observe(el);
    });
  }

  // --- Dynamic Works (Top page) ---
  const worksGrid = document.getElementById('works-grid');
  if (worksGrid && typeof WorksStore !== 'undefined') {
    const works = WorksStore.getPublished().slice(0, 3);
    worksGrid.innerHTML = works.map(w => `
      <div class="works-card reveal">
        <div class="works-card-img">
          <img src="${w.image}" alt="${w.title}" loading="lazy">
          <span class="works-card-category">${w.category}</span>
        </div>
        <div class="works-card-body">
          <h3>${w.title}</h3>
          <p>${w.description.slice(0, 60)}...</p>
          <p class="works-card-meta">${w.location}</p>
        </div>
      </div>
    `).join('');
    worksGrid.querySelectorAll('.reveal').forEach(el => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.1 });
      obs.observe(el);
    });
  }
});
