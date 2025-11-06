export async function getRankingByFaculty(faculty) {
  const res = await fetch(import.meta.env.VITE_API_URL + `user/ranking/${faculty}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to fetch user ranking data')
  }

  return res.json()
}

export async function getAllRanking() {
  const res = await fetch(import.meta.env.VITE_API_URL + `user/ranking`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to fetch user ranking data')
  }

  return res.json()
}

export async function sendPhoto(userId, imgBlob) {
  const formData = new FormData()
  formData.append('photo', imgBlob, 'food.png')

  const res = await fetch(import.meta.env.VITE_API_URL + `purchase/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: imgBlob,
    credentials: 'include',
  })
  return res.json()
}
