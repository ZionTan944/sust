export async function getAllRewards() {
  const res = await fetch(import.meta.env.VITE_API_URL+`rewards/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch user ranking data');
  }

  return res.json();
}

export async function getValidRewards() {
  const res = await fetch(import.meta.env.VITE_API_URL+`rewards/valid`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch user ranking data');
  }

  return res.json();
}
