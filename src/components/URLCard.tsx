import { useCallback } from "react"

type IURLCardProps = {
  original: string,
  shortenedUrl: string,
  views: number,
  createdAt: Date,
  lastView: Date | null,
  alias: string
  id: string
}

export const URLCard = ({ id, original, shortenedUrl, views, lastView, alias }: IURLCardProps) => {

  const handleDelete = () => {
    fetch(`/api/link/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        window.dispatchEvent(new CustomEvent("link-deleted", { detail: id }))
      }
    })
  }
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shortenedUrl)
  }, [shortenedUrl])
  return (
    <li
      className="flex flex-col overflow-hidden rounded-md transition-all duration-300 hover:scale-105 hover:cursor-pointer w-full bg-[rgba(71,78,94,1)]"
      aria-label="shortened url"
    >
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-3 h-full w-full px-4 py-3"
        href={shortenedUrl}
      >
        <h2 className="font-semibold text-white truncate">
          {alias}
        </h2>
        <p className="flex gap-2 text-gray-300">
          <svg className="w-6 h-6 shrink-0">
            <use href="#icon-shortened-url"></use>
          </svg>
          <span className="truncate">
            {shortenedUrl}
          </span>
        </p>
        <p className="flex gap-2 text-gray-300">
          <svg className="w-6 h-6 shrink-0">
            <use href="#icon-link"></use>
          </svg>
          <span className="truncate">
            {original}
          </span>
        </p>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 shrink-0">
              <use href="#icon-last-view"></use>
            </svg>
            <time
              className="text-gray-300 font-semibold"
              aria-label="last view"
              dateTime={lastView ? lastView.toISOString() : ""}
            >
              {
                lastView ? new Date(lastView).toLocaleDateString() : "Never viewed"
              }
            </time>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 shrink-0">
              <use href="#icon-eye"></use>
            </svg>
            <span
              className="text-gray-300 font-semibold"
              aria-label="views"
            >
              {views}
            </span>
          </div>
        </div>
      </a>
      <div className="flex">
        <button
          className="flex items-center justify-center py-1 flex-1 bg-blue-500 hover:bg-blue-700"
          onClick={handleCopy}
          aria-label="copy shortened url"
        >

          <svg className="h-5 w-5 shrink-0">
            <use href="#icon-copy"></use>
          </svg>

        </button>
        <button
          className="flex items-center justify-center py-1 flex-1 bg-red-500 hover:bg-red-700"
          onClick={handleDelete}
          aria-label="delete shortened url"
        >
          <svg className="h-5 w-5 shrink-0">
            <use href="#icon-trash"></use>
          </svg>
        </button>
      </div>
    </li>
  )
}
