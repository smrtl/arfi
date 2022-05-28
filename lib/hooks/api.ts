import { useState } from "react";
import axios, { Method } from "axios";
import useSWR, { SWRConfiguration } from "swr";

const client = axios.create({
  baseURL: "/api/",
});

enum Status {
  Init,
  Loading,
  Loaded,
  Error,
}

interface State {
  data: any;
  error: string;
  status: Status;
}

export function useSendApi(endpoint: string) {
  const controller = new AbortController();
  const initState = { data: null, error: null, status: Status.Init };
  const [state, setState] = useState<State>(initState);
  const setError = (error: string) => setState({ data: null, error, status: Status.Error });

  const send = (method: Method, data: any = {}) => {
    if (state.status == Status.Loading) controller.abort();
    setState({ ...state, error: null, status: Status.Loading });

    const dataKey = method.toLowerCase() === "get" ? "params" : "data";

    return client
      .request({
        url: endpoint,
        method: method,
        [dataKey]: data,
        signal: controller.signal,
      })
      .then(({ data }) => {
        setState({ data, error: null, status: Status.Loaded });
      })
      .catch((err) => {
        let message = err.message;
        if (err.response && err.response.data && err.response.data.error) {
          message += `\n\n${err.response.data.error}`;
          if (err.response.data.errors) message += `\n${err.response.data.errors.join("\n")}`;
        }
        setError(message);
      });
  };

  return {
    isLoading: state.status == Status.Loading,
    isLoaded: state.status == Status.Loaded,
    data: state.data,
    error: state.error,
    clear: () => {
      if (state.status == Status.Loading) controller.abort();
      setState(initState);
    },
    send,
    get: (data: any = {}) => send("GET", data),
    post: (data: any = {}) => send("POST", data),
    del: (data: any = {}) => send("DELETE", data),
  };
}

export function useApi(endpoint: string, config?: SWRConfiguration) {
  return useSWR(endpoint, (url: string) => client.get(url).then((res) => res.data), config);
}
