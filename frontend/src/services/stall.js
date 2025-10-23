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

export async function getStallRankings() {
  const res = await fetch(`${API_URL}/stall/ranking`, {
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