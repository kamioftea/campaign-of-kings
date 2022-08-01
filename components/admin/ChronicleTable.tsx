import {useAdminChronicles} from "../../hooks/use-admin-chronicles";


export function ChronicleTable() {
    const {user, isLoading, error, chronicles} = useAdminChronicles();

    if (!user || isLoading) {
        return <div className="callout secondary">Loading ...</div>
    }

    if (error) {
        return <div className="callout alert">
            There was an error loading the chronicles: {error}
        </div>
    }

    return <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Published</th>
                <th>Snippet</th>
                <th />
            </tr>
        </thead>
        <tbody>
            {chronicles
                .sort((a, b) => b.published.getTime() - a.published.getTime())
                .map(c =>
                    <tr key={c._id}>
                        <td>{c.title}</td>
                        <td>
                            {c.published.toLocaleDateString()}
                            {c.draft && <span className="label secondary">Draft</span> }
                        </td>
                        <td>{c.slug}</td>
                        <td/>
                    </tr>
                )
            }
        </tbody>
    </table>;
}
