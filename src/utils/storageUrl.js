const STORAGE_ORIGIN = (
  import.meta.env.VITE_PROFILE_IMG_URL ||
  import.meta.env.VITE_APP_URL ||
  'https://adminapi.dotsafetyservice.com'
).replace(/\/$/, '');

/** public/storage/foo → storage/foo */
function toStoragePath(value) {
  let path = String(value || '').trim();
  if (!path) return '';

  if (/^https?:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname;
    } catch {
      path = path.replace(/^https?:\/\/[^/]+/i, '');
    }
  }

  path = path.replace(/^\/+/, '');
  path = path.replace(/^app\/public\/+/i, '');
  path = path.replace(/^public\/+/i, '');
  if (path && !/^storage\//i.test(path)) {
    path = `storage/${path}`;
  }
  return path;
}

/** Live API file URL: .../storage/profiles/file.jpeg */
export function storageUrl(path) {
  const normalized = toStoragePath(path);
  if (!normalized) return '';
  return `${STORAGE_ORIGIN}/${normalized}`;
}

export function profileUrl(_base, profile) {
  if (!profile) return null;
  return storageUrl(profile);
}

export function fileUrl(_storageBase, path) {
  if (!path) return '#';
  return storageUrl(path) || '#';
}
