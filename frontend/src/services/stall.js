const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

export async function getStallById(stallId) {
  const res = await fetch(`${API_URL}/stall/${stallId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch stall data');
  }
  
  return res.json();
}

/**
 * Fetch stall images. Supports optional pagination options { limit, offset }.
 * If no limit is provided, the backend will return all images (may be heavy).
 */
export async function getStallImages(stallId, opts = {}) {
  const params = new URLSearchParams();
  // prefer page-based API: ?page=1&pageSize=12
  if (opts.page != null) params.append('page', String(opts.page));
  if (opts.pageSize != null) params.append('pageSize', String(opts.pageSize));
  // keep backward-compat: accept limit/offset if caller used them
  if (opts.limit != null) params.append('limit', String(opts.limit));
  if (opts.offset != null) params.append('offset', String(opts.offset));

  const url = `${API_URL}/stall/${stallId}/images${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch stall images');
  }

  return res.json();
}

export async function getStallRankings(range = 'all') {
  let url = `${API_URL}/stall/ranking`;
  if (range && range !== 'all') {
    url += `?range=${range.toLowerCase()}`;
  }
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch stall rankings');
  }
  
  return res.json();
}