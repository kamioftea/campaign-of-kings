import type {NextPage} from 'next'
import styles from '../styles/StandardPage.module.scss'
import {DefaultHead} from "../components/DefaultHead";

const About: NextPage = () => {
    return (
        <>
            <DefaultHead title="About"/>

            <main className={`${styles.content}`}>
                <h1>About The Campaign</h1>
                <p>
                    You will pick a single force list and build up a Vanguard warband and Kings of War army for that
                    faction. Each month you will be paired with an opponent, and will play a Vanguard and a Kings of War
                    game with the following points values:
                </p>
                <table>
                    <thead>
                        <tr>
                            <td>Month</td>
                            <td>Vanguard Roster</td>
                            <td>Vanguard Warband</td>
                            <td>Kings of War</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>January</td>
                            <td>200</td>
                            <td>75</td>
                            <td>500</td>
                        </tr>
                        <tr>
                            <td>February</td>
                            <td>300</td>
                            <td>100</td>
                            <td>750</td>
                        </tr>
                        <tr>
                            <td>March</td>
                            <td>300</td>
                            <td>125</td>
                            <td>1000</td>
                        </tr>
                        <tr>
                            <td>April</td>
                            <td>400</td>
                            <td>150</td>
                            <td>1250</td>
                        </tr>
                        <tr>
                            <td>May</td>
                            <td>400</td>
                            <td>175</td>
                            <td>1500</td>
                        </tr>
                        <tr>
                            <td>June</td>
                            <td>500</td>
                            <td>200</td>
                            <td>2000</td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    The first two games will be using the smaller games variants. For Vanguard this means the commander
                    is optional, and only two warriors are required. For Kings of War it means troops do not need to be
                    unlocked by larger units.
                </p>
                <p>
                    The Vanguard games will follow the standard campaign rules, but with a reduced size campaign roster.
                    After your first, third, and fifth games you have the opportunity to expand your campaign roster by
                    100pts. Any unspent points can be carried forward to the next roster expansion opportunity.
                </p>
                <p>
                    The first month's pairings will be random. The pairings and scenarios to be played will be announced
                    at the start of the month. Both Vanguard and Kings of War games will be scored out of maximum 15
                    points. Five points for a win, two for a draw, 0 for a loss. There will be up to five points for the
                    amount of your opponent's force that was routed, and up to five points from the scenario objectives.
                    The precise kill point boundaries and objective scoring will be published with the scenario
                    announcement each month. If there are enough players that you will not face every opponent then
                    pairings will use Swiss ranking. Otherwise pairings will be random until everyone has faced
                    each other, then any remaining games will use Swiss ranking.
                </p>
                <h2>Territories</h2>
                <p>
                    When picking your Kings of War force, you are limited by the territory you control. Each territory
                    will unlock one or more specific unit types from those available in your chosen force list. When you
                    claim a territory, you will choose which unit type it will unlock. You may use any number / size of
                    the unlocked unit types in your list, but must still follow the standard rules for unlocking troops,
                    heroes, war machines, monsters, and titans, and the maximum allowed duplicates for that month’s
                    points value.
                </p>

                <table>
                    <thead>
                        <tr>
                            <td>D6</td>
                            <td>Territory Type</td>
                            <td>Unlocks</td>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>-</td>
                            <td>Base Camp</td>
                            <td>
                                Two standard* unit types<br/>
                                One hero type<br/>
                                One magic item
                            </td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Cave</td>
                            <td>One monster type</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Mountain</td>
                            <td>One titan unit type</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Forest</td>
                            <td>One war machine unit type</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>Village</td>
                            <td>One standard* unit type</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>Training Camp</td>
                            <td>One irregular unit type</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>Ancient Ruins</td>
                            <td>One hero type<br/>One magic item</td>
                        </tr>
                    </tbody>

                </table>
                <p>
                    <small>
                        *A standard unit is any infantry, heavy infantry, large infantry, monstrous infantry, cavalry,
                        large cavalry, chariot, or swarm unit that is not irregular.
                    </small>
                </p>

                <p>
                    You start the campaign with a base camp and one other territory of your choice. After each month
                    roll to see what territory types are available to conquer:
                </p>

                <table>
                    <tbody>
                        <tr>
                            <th style={{width: '50%'}}>Base</th>
                            <td>2D6</td>
                        </tr>
                        <tr>
                            <th>Won Vanguard Game?</th>
                            <td>+D6</td>
                        </tr>
                        <tr>
                            <th>Won Kings of War Game?</th>
                            <td>+D6</td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    You then select one of the results to claim, choosing the specific unit type it unlocks. You may
                    re-roll any result where there are no more entries of that type to unlock from your force list.
                </p>

                <h2>An Example Campaign Setup</h2>
                <p>
                    Alice has chosen Goblins as her faction. She builds a campaign roster of 196 points for Vanguard,
                    leaving 4 points unspent. From this she will select a 75 point warband to play her first game once
                    she knows what the scenario will be and what faction her opponent will be using.
                </p>

                <p>
                    Alice selects Fleabag Riders, Sharpsticks, Wizzes, and the Inspiring Talisman as the unlocks from
                    her Base Camp. She then selects a cave for her second territory, and decides it will unlock
                    Winggits. For her first Kings of War game she will need to build a 500 point army with just those
                    units. She can have any number of Sharpstick regiments, hordes, or legions; and any number of
                    Fleabag Rider regiments or hordes. Any Fleabag Rider troops, Wizzes, and Winggits need to be
                    unlocked by other units as normal. At 500 she is limited to only one each of the Wiz and Wingit due
                    to the maximum duplicates rule.
                </p>

                <p>
                    Alice has been paired up to play against Bob's Herd. The scenarios are Supply Grab, and Invade.
                </p>

                <p>
                    She wins the Vanguard game and goes through the campaign post-game process as normal, resolving
                    casualties, experience, exploration, etc. Before her next Vanguard game she can also add up to
                    another 104 points to her campaign roster (+100 from the points table, +4 unspent points from her
                    starting roster.)
                </p>

                <p>
                    Alice loses the Kings of War game. This means she only gets three dice to roll on the territory
                    table, two D6 as a base, and one extra for winning the Vanguard game. She rolls a 3, 4, and 6. She
                    picks the forest (3) and decides to unlock Mawpup Launchers. Bob also gets to roll three dice, two
                    base, plus one for winning the Kings of War game. He rolls a 1, 3, and 5. The Herd don't have any
                    War Machines in their force list, and Bob already took a cave (1) as his choice for extra terrain
                    at the start, unlocking the only monster available to him - the Beast of Nature. Because of this he
                    can re-roll both the 1 and 3, getting a 4 and another 5. He takes one of the 5s to build a training
                    camp, choosing to add Tribal Trappers to his unit options.
                </p>

                <h1>About Chesterfield Open Gaming Society</h1>
                <p>
                    Chesterfield Open Gaming Society has been open to all gamers whether beginner or veteran since
                    December 1996. We meet every week to to play a diverse selection of war games and board games.
                    Club nights are held every Monday evening, and on the second and fourth Wednesday evenings of the
                    month, from 7pm until 10pm at:
                </p>
                <p style={{marginLeft: '2rem'}}>
                    The Parish Centre<br/>
                    Stonegravels<br/>
                    91 Sheffield Road<br/>
                    Chesterfield<br/>
                    S41 7JH
                </p>
                <p>
                    Entry is £3 per evening, with your first session being free. For more details see the{' '}
                    <a href="http://www.c-o-g-s.org.uk/">Club Website</a> and join our{' '}
                    <a href="https://www.facebook.com/groups/118722704820567/">Facebook page</a>.
                </p>
            </main>
        </>
    )
}

export default About
