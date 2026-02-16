// 管理画面パスワード認証
// デモ用パスワード: demo1234
const PASSWORD_HASH = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'; // sha256("demo1234") - will be set properly

(function () {
  const STORAGE_KEY = 'admin_auth_hash';

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function isAuthenticated() {
    return sessionStorage.getItem(STORAGE_KEY) === 'authenticated';
  }

  function showGate() {
    document.body.style.visibility = 'hidden';

    const overlay = document.createElement('div');
    overlay.id = 'auth-gate';
    overlay.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(14,34,52,0.95);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(8px);">
        <div style="background:#fff;border-radius:16px;padding:40px;max-width:380px;width:90%;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.3);">
          <div style="font-size:32px;margin-bottom:8px;">🔒</div>
          <h2 style="font-size:20px;color:#1a3a5c;margin-bottom:4px;">管理画面</h2>
          <p style="font-size:13px;color:#999;margin-bottom:24px;">パスワードを入力してください</p>
          <input type="password" id="auth-password" placeholder="パスワード"
            style="width:100%;padding:14px;border:2px solid #e8ecf0;border-radius:8px;font-size:15px;outline:none;transition:border-color 0.2s;text-align:center;"
            onfocus="this.style.borderColor='#2e6b96'" onblur="this.style.borderColor='#e8ecf0'">
          <p id="auth-error" style="color:#e74c3c;font-size:13px;margin-top:8px;display:none;">パスワードが違います</p>
          <button id="auth-submit"
            style="width:100%;margin-top:16px;padding:14px;background:#1a3a5c;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;transition:background 0.2s;"
            onmouseover="this.style.background='#2e6b96'" onmouseout="this.style.background='#1a3a5c'">ログイン</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.visibility = 'visible';

    const input = document.getElementById('auth-password');
    const submit = document.getElementById('auth-submit');
    const error = document.getElementById('auth-error');

    async function tryAuth() {
      const hash = await sha256(input.value);
      // デモ用: パスワードは "demo1234"
      if (input.value === 'demo1234') {
        sessionStorage.setItem(STORAGE_KEY, 'authenticated');
        overlay.remove();
        document.body.style.visibility = 'visible';
        if (typeof window.onAdminAuth === 'function') window.onAdminAuth();
      } else {
        error.style.display = 'block';
        input.style.borderColor = '#e74c3c';
        input.value = '';
        setTimeout(() => { error.style.display = 'none'; input.style.borderColor = '#e8ecf0'; }, 2000);
      }
    }

    submit.addEventListener('click', tryAuth);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryAuth(); });
    setTimeout(() => input.focus(), 100);
  }

  if (!isAuthenticated()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showGate);
    } else {
      showGate();
    }
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof window.onAdminAuth === 'function') window.onAdminAuth();
    });
  }
})();
