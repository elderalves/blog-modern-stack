export const postTrackEvent = (event) => {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then((response) => response.json())
}

export const getTotalViews = (postId) => {
  return fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/totalViews/${postId}`,
  ).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
}

export const getDailyViews = (postId) => {
  return fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/dailyViews/${postId}`,
  ).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
}

export const getDailyDurations = (postId) => {
  return fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/dailyDurations/${postId}`,
  ).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
}
