import type {NextPage} from 'next'
import styles from '../styles/Home.module.scss'
import {DefaultHead} from "../components/DefaultHead";

const Home: NextPage = () => {
  return (
      <>
          <DefaultHead />

          <main className={`${styles.content}`}>
              <h1>Conquest or Death Await...</h1>
              <p>
                  Hell&apos;s Claw. A frozen island far off the north-eastern edge of most sailors&apos; maps. To even
                  reach its desolate shores is to brave months on the endless sea, ever shifting icebergs from the
                  north, and the terrors hiding in the deeps. There have always been rumours told in dingy dockside
                  taverns of great wealth and power there. Sometimes it is that an ancient dragon keeps a horde there,
                  or maybe an abyssal warlock has fled there and opened a portal to other planes.
              </p>
              <p>
                  But now a new rumour is being spread. That a longboat of Ice-kin Hunters crept up the Iceblood Fjord
                  under cover of darkness. That they had voyaged to Hell&apos;s Claw and returned. That they brought news to
                  Chill of that some great power is stirring there.
              </p>
              <p>
                  Expeditionary forces have been mustered, supplies acquired. Whether for fame or duty, wealth, power,
                  or glory, a few fool-hardy souls have crossed the Endless Sea...
              </p>
              <h2>What?</h2>
              <p>The Conquest of Hell&apos;s Claw is a Kings of War and Vanguard Escalation Campaign.</p>
              <h2>Where?</h2>
              <p>
                  Chesterfield Open Gaming Society. Club nights are held at The Parish Centre, Stonegravels,
                  Chesterfield. See the <a href="http://www.c-o-g-s.org.uk/p/location.html">COGS Website</a> for
                  details.
              </p>
              <h2>When?</h2>
              <p>
                  January until June, 2022. One game each of Vanguard and Kings of War per month. Club nights are
                  Mondays, plus second and fourth Wednesdays, 19:00 - 22:00.
              </p>
          </main>
      </>
  )
}

export default Home
