import useSwr, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useApi(endpoint: string, autofetch = false) {
  return useSwr(`/api/${endpoint}`, fetcher, {
    revalidateOnMount: autofetch,
    revalidateOnReconnect: autofetch,
    revalidateOnFocus: autofetch,
    revalidateIfStale: autofetch,
  });
}
