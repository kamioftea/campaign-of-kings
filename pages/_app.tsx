import '../styles/globals.scss'
import type {AppProps} from 'next/app'
import {TopBar} from "../components/TopBar";
import {UserProvider} from "../components/UserContext";

function MyApp({ Component, pageProps }: AppProps) {
  return <UserProvider>
    <div className="app-wrapper">
      <TopBar/>
      <Component {...pageProps} />
    </div>
  </UserProvider>
}

export default MyApp
