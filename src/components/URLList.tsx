import { useEffect, useState } from "react"
import { URLCard } from "./URLCard"
import type { ILink } from "../db/models/Link"
import { getUser } from "../lib/api_client"

export const URLList = () => {
  const [fetching, setFetching] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [shortenedURLs, setShortenedURLs] = useState<
    {
      id: string,
      url: string,
      shortenedUrl: string,
      clicks: number,
      lastView: Date,
      createdAt: Date,
      alias: string
    }[]
  >([])

  const refreshList = () => {
    setRefreshing(true)
    getUser().then((links) => {
      setShortenedURLs(links)
      setRefreshing(false)
    })
  }

  useEffect(() => {
    getUser().then((links) => {
      setShortenedURLs(links)
      setFetching(false)
    })

    window.addEventListener("link-shortened", (e: CustomEvent<ILink>) => {
      setShortenedURLs(prev =>
        [
          {
            id: e.detail.id,
            url: e.detail.url,
            shortenedUrl: window.location.origin + "/" + e.detail.id,
            clicks: e.detail.clicks,
            lastView: e.detail.lastViewed,
            createdAt: e.detail.createdAt,
            alias: e.detail.alias
          },
          ...prev
        ]
      )
    })
    window.addEventListener("link-deleted", (e: CustomEvent<string>) => {
      setShortenedURLs(prev => prev.filter(link => link.id !== e.detail))
    })
  }, [])

  return (
    <section className="flex-1">
      <div className="flex items-center mt-14 gap-3">
        <h2 className="text-white text-3xl font-bold">Shortened URLs</h2>
        <button
          className="hover:scale-110 transition-all duration-300"
          onClick={refreshList}
          arial-label="Refresh list"
        >
          <svg
            className={`w-6 h-6 ${refreshing ? "animate-spin" : ""}`}
            viewBox="0 0 24 24"

          >
            <use href="#icon-refresh"></use>
          </svg>
        </button>
      </div>
      {
        fetching && <p className="text-white mt-5">
          Looking for your shortened URLs...
        </p>
      }
      {
        (shortenedURLs.length > 0 && !fetching) && (
          <ol
            id="shortened-list font-semibold"
            className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
            aria-label="List of shortened URLs"
          >
            {
              shortenedURLs.map((link) => {
                return (
                  <URLCard
                    key={link.id}
                    original={link.url}
                    shortenedUrl={link.shortenedUrl}
                    views={link.clicks}
                    createdAt={link.createdAt}
                    lastView={link.lastView}
                    alias={link.alias}
                    id={link.id}
                  />
                )
              })
            }
          </ol>
        )
      }
      {
        (shortenedURLs.length === 0 && !fetching) && (
          <p className="text-white mt-5">
            You haven't shortened any URLs yet.
          </p>
        )
      }
    </section>
  )
}
