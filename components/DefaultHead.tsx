import Head from "next/head";

interface DefaultHeadProps {
    title?: string
    description?: string
}

export function DefaultHead({title, description}: DefaultHeadProps) {
    const title_parts = title ? [title] : [];
    title_parts.push("The Conquest of Hell's Claw");
    title_parts.push("A Kings of War Campaign");

    description = description ?? "The Conquest of Hell's Claw is a Kings of War and Vanguard Escalation Campaign" +
        " running at Chesterfield Open Gaming Society";

    return <Head>
        <title>{title_parts.slice(0, 2).join(' | ')}</title>
        <meta name="description"
              content={description}/>
        <link rel="icon" href="/favicon.ico"/>
        <meta name="l"/>
    </Head>;
}
