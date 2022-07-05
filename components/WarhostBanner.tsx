import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Warhosts.module.scss";
import {titleSlug} from "../lib/text";
import {WarhostSummary} from "../model/Warhost";

export interface WarhostBannerProps {
    slug?: string,
    warhost: WarhostSummary
}

export function WarhostBanner({slug, warhost}: WarhostBannerProps) {
    const banner =
        <div className={styles.summaryContainer}
             style={{backgroundImage: `url(${warhost.coverImageUrl})`}}
        >
            <Image className={styles.icon}
                 src={`/images/icons/${warhost.army}.png`}
                 alt={warhost.army}
            />
            <div className={styles.label}>
                <h2>{warhost.name}</h2>
                <p>{warhost.user_name} - {titleSlug(warhost.army)}</p>
            </div>
        </div>;

    return slug
        ? <Link href={`/warhosts/${slug}`}><a>{banner}</a></Link>
        : banner;
}
