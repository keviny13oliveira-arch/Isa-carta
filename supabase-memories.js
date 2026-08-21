/* Memórias na nuvem — Isa-carta */
const SUPABASE_URL = 'https://nhmgqktflcuwqzawfxan.supabase.co';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_mVmLJLRskPluXZwqIUDtew_tBiTYlmD';

(function () {
  const STORAGE_BUCKET = 'memory-media';
  const PHOTO_TABLE = 'memories';
  const TEXT_TABLE = 'text_memories';

  async function api(path, options = {}) {
    const headers = Object.assign({
      apikey: SUPABASE_PUBLIC_KEY,
      Authorization: 'Bearer ' + SUPABASE_PUBLIC_KEY,
      'Content-Type': 'application/json'
    }, options.headers || {});
    const response = await fetch(SUPABASE_URL + '/rest/v1/' + path, Object.assign({}, options, { headers }));
    if (!response.ok) throw new Error(await response.text());
    return response.status === 204 ? null : response.json();
  }

  async function upload(file, folder) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = folder + '/' + Date.now() + '_' + safeName;
    const response = await fetch(SUPABASE_URL + '/storage/v1/object/' + STORAGE_BUCKET + '/' + path, {
      method: 'POST',
      headers: { apikey: SUPABASE_PUBLIC_KEY, Authorization: 'Bearer ' + SUPABASE_PUBLIC_KEY, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'false' },
      body: file
    });
    if (!response.ok) throw new Error(await response.text());
    return SUPABASE_URL + '/storage/v1/object/public/' + STORAGE_BUCKET + '/' + path;
  }

  async function saveText(title, content) {
    return api(TEXT_TABLE, { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ title: title || null, content }) });
  }

  async function loadTexts() {
    return api(TEXT_TABLE + '?select=*&order=created_at.desc');
  }

  async function savePhoto(file, caption) {
    const url = await upload(file, 'photos');
    return api(PHOTO_TABLE, { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ media_type: 'photo', file_url: url, caption: caption || null }) });
  }

  async function saveVideo(file, caption) {
    const url = await upload(file, 'videos');
    return api(PHOTO_TABLE, { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ media_type: 'video', file_url: url, caption: caption || null }) });
  }

  async function loadMedia() {
    return api(PHOTO_TABLE + '?select=*&order=created_at.asc');
  }

  window.MemoriesCloud = { ready: true, saveText, loadTexts, savePhoto, saveVideo, loadMedia };
})();
