export async function getAllRewards(userId) {
  const res = await fetch(import.meta.env.VITE_API_URL+`rewards/all/`+userId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch reward data');
  }

  return res.json();
}

export async function getValidRewards(userId) {
  const res = await fetch(import.meta.env.VITE_API_URL+`rewards/valid/`+userId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch reward data');
  }

  return res.json();
}

export async function claimReward(userId, rewardId) {
  const res = await fetch(import.meta.env.VITE_API_URL+`rewards/${rewardId}/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "userid": userId
    }),
    credentials: 'include',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to claim reward');
  }

  return res.json();
}
