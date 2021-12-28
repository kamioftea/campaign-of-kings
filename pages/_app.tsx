import '../styles/globals.scss'
import type {AppProps} from 'next/app'
import {TopBar} from "../components/TopBar";
import {UserProvider} from "../components/UserContext";
import {IconContext} from "react-icons";

function MyApp({ Component, pageProps }: AppProps) {
  return <IconContext.Provider value={{className: 'react-icons'}}>
    <UserProvider>
      <div className="app-wrapper">
        <TopBar/>
        <Component {...pageProps} />
      </div>
    </UserProvider>
  </IconContext.Provider>
}

export default MyApp
