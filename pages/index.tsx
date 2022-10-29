import type {NextPage} from 'next'
import styles from '../styles/Home.module.scss'
import {DefaultHead} from "../components/DefaultHead";
import Link from "next/link";

const Home: NextPage = () => {
  return (
      <>
          <DefaultHead />

          <main className={`${styles.content}`}>
              <h1>The Twilight Mists</h1>
              <div className={`${styles.split}`}>
                  <div>
                      <h2>What?</h2>
                      <p>The Twilight Mists is a narrative Kings of War Escalation Campaign.</p>
                      <h2>Where?</h2>
                      <p>
                          Chesterfield Open Gaming Society. Club nights are held at The Parish Centre, Stonegravels,
                          Chesterfield. See the <a href="http://www.c-o-g-s.org.uk/p/location.html">COGS Website</a> for
                          details.
                      </p>
                      <h2>When?</h2>
                      <p>
                          September 2022 until February 2023, one game per month.
                      </p>
                  </div>
                  <div>
                      <Link href={"/about"}>
                          <a className="button primary">Read the rules pack</a>
                      </Link>
                      <Link href={"/warhost"}>
                          <a className="button primary">Join the campaign</a>
                      </Link>
                  </div>
              </div>
          </main>
      </>
  )
}

export default Home
