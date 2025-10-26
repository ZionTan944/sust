export async function getRankingByFaculty(faculty) {
  const res = await fetch(import.meta.env.VITE_API_URL+`user/ranking/${faculty}`, {
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

export async function getAllRanking() {
  const res = await fetch(import.meta.env.VITE_API_URL+`user/ranking`, {
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
