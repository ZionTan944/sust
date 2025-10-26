export async function getChallenges() {
  const res = await fetch(import.meta.env.VITE_API_URL+`challenges/`, {
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

export async function getPointsByUser(userId) {
  const res = await fetch(import.meta.env.VITE_API_URL+`points/total/`+userId, {
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
