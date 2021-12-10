import "../styles/globals.css";
import type { AppProps } from "next/app";
import Context, { defaultState } from "../context/Context";
import { useReducer } from "react";
import { reducer } from "../context/reducer";

function MyApp({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      <Component {...pageProps} />
    </Context.Provider>
  );
}

export default MyApp;
