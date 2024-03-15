import type { CreateLinkResponse, GetUserResponse } from "./api"

export const getUser = async () => {
  const token = localStorage.getItem("auth-token")
  const res = await fetch("/api/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })

  const data: GetUserResponse = await res.json()

  if (res.ok) {
    return data.data.links.map(
      link => (
        {
          id: link.id,
          url: link.url,
          shortenedUrl: window.location.origin + "/" + link.id,
          clicks: link.clicks,
          lastView: link.lastViewed ? new Date(link.lastViewed) : null,
          createdAt: link.createdAt,
          alias: link.alias
        }
      )
    )
  } else {
    return []
  }
}

export const shortenURL = async (url: string, alias: string) => {
  const res = await fetch("/api/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, alias }),
  })

  const data: CreateLinkResponse = await res.json()

  if (data.data === null) {
    return { error: true, message: data.message, url: null };
  }

  const location = window.location.origin + "/" + data.data.id;
  if (data.data !== null && res.ok) {
    return { error: false, message: `Your URL: ${location}`, data: data.data };
  }
}
