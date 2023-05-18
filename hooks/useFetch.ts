import useSWR from "swr";

export interface FetcherStatus<T = any> {
  data?: T;
  error?: Error;
  isLoading: boolean;
  isValidating: boolean;
  status: "loading" | "success" | "error" | "notfound";
  msg?: string;
}

async function defaultFetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(
      data.msg || `Failed to fetch data from ${url}: ${response.statusText}`
    );
    throw error;
  }
  return data;
}

export default function useFetch<T = any>(
  url: string,
  config?: any,
  fetcher?: (url: string) => Promise<T>
): FetcherStatus<T> {
  const { data, error, isValidating } = useSWR<T>(
    url,
    fetcher ?? defaultFetcher,
    config
  );
  const isLoading = !data && !error;
  const status = isLoading
    ? "loading"
    : !data
    ? "error"
    : (Array.isArray(data) && data.length === 0) ||
      (typeof data === "object" &&
        data !== null &&
        // @ts-ignore
        (!data.hasOwnProperty("result") || data.result.length === 0))
    ? "notfound"
    : "success";

  return {
    // @ts-ignore
    data: data?.result,
    error,
    isLoading,
    isValidating,
    status,
    // @ts-ignore
    msg: data?.msg,
  };
}
