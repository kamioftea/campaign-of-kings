import '../styles/globals.scss'
import type {AppProps} from 'next/app'
import {TopBar} from "../components/TopBar";

function MyApp({ Component, pageProps }: AppProps) {
  return <div className="app-wrapper">
    <TopBar />
    <Component {...pageProps} />
  </div>
}

export default MyApp
