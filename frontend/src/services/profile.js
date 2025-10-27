export async function getChallenges(userId) {
  const res = await fetch(import.meta.env.VITE_API_URL+`challenges/all/`+userId, {
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

export async function sendChallengeCompletion(userId, challengeId, evidence) {
  const res = await fetch(import.meta.env.VITE_API_URL+`challenges/${challengeId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'userid': userId,
      'evidence': evidence
    }),
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

export async function getPointByDuration(userId, duration) {
  const res = await fetch(import.meta.env.VITE_API_URL+`points/summary/${userId}?range=${duration}`, {
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
