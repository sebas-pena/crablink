import { useRef, useState, useEffect } from "react";
import type { ILink } from "../db/models/Link";
import { shortenURL } from "../lib/api_client";

const URL_VALIDATION_REGEX = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i

export const URLForm = () => {

  const [result, setResult] = useState<{ error: boolean, message: string, fetching: boolean }>({
    error: false,
    message: "",
    fetching: false,
  });

  const urlRef = useRef(null);
  const aliasRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (result.fetching) return;

    if (urlRef.current.value === "") {
      setResult({ error: true, message: "URL is required", fetching: false });
      return;
    }

    if (!URL_VALIDATION_REGEX.test(urlRef.current.value)) {
      setResult({ error: true, message: "Invalid URL", fetching: false });
      return;
    }

    const url = urlRef.current.value;
    const alias = aliasRef.current.value;
    setResult({ error: false, message: "", fetching: true });
    shortenURL(url, alias)
      .then(res => {
        if (res.error) {
          setResult({ ...res, fetching: false });
          return;
        }

        const location = window.location.origin + "/" + res.data.id;
        setResult({ ...res, fetching: false })
        const event = new CustomEvent<ILink>("link-shortened", { detail: res.data });
        window.dispatchEvent(event);
      })
  }

  return (
    <>
      <form className="mt-14 flex flex-col gap-1" onSubmit={handleSubmit}>
        <input
          type="text"
          name="url"
          placeholder="Enter a URL to shorten"
          className="w-full font-semibold border border-gray-100 focus:border-blue-500 focus:outline-none px-4 h-12 rounded-lg bg-gray-100"
          ref={urlRef}
          aria-errormessage="result"
          aria-invalid={result.error}
        />
        <input
          type="text"
          name="alias"
          placeholder="Add a title for your URL"
          className="w-full font-semibold border border-gray-100 focus:border-blue-500 focus:outline-none px-4 h-12 rounded-lg bg-gray-100"
          ref={aliasRef}
        />
        <button
          type="submit"
          className="send-button flex items-center justify-center gap-3 p-2 px-4 rounded-lg border-none transition-all  disabled:transition-none disabled:bg-none disabled:bg-neutral-400 duration-300 bg-send-button bg-200 bg-center-top hover:bg-center-bottom"
          disabled={result.fetching}
        >
          <svg className={`${result.fetching ? 'animate-spin' : ''} w-8 h-8`} viewBox="0 0 24 24">
            <use href={result.fetching ? '#icon-spinner' : '#icon-send'}></use>
          </svg>
          <p className="text-white font-semibold">
            {
              result.fetching ? "Shortening..." : "Shorten"
            }
          </p>
        </button>
      </form>
      <p
        id="result"
        className={`h-5 mt-4 ${result.error ? 'text-red-500' : 'text-white'}  font-semibold text-md sm:text-xl text-center`}
      >
        {result.message}
      </p>
    </>
  );
}
