import {useAdminChronicles} from "../../hooks/use-admin-chronicles";
import {ReviewStatus} from "../../model/ChronicleDocument";
import {ReactNode} from "react";
import {FiPause} from "react-icons/all";
import {FiCheck, FiX} from "react-icons/fi";


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

    function getStatusLabelClass(status: ReviewStatus): string {
        switch (status) {
            case ReviewStatus.PENDING: return 'secondary';
            case ReviewStatus.ACCEPTED: return 'success';
            case ReviewStatus.REJECTED: return 'alert';
        }
    }

    function getStatusIcon(status: ReviewStatus): ReactNode {
        switch (status) {
            case ReviewStatus.PENDING: return <FiPause />;
            case ReviewStatus.ACCEPTED: return <FiCheck />;
            case ReviewStatus.REJECTED: return <FiX />;
        }
    }

    return <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Published</th>
                <th>Slug</th>
                <th>Author</th>
                <th/>
            </tr>
        </thead>
        <tbody>
            {chronicles
                .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime())
                .map(c =>
                    <tr key={c._id}>
                        <td>{c.approvedContent?.title ?? c.draftContent?.title ?? '-'}</td>
                        <td>
                            {c.publishedDate?.toLocaleDateString() ?? '-'}
                            {c.reviewStatus &&
                                <span className={['label', getStatusLabelClass(c.reviewStatus)].join(' ')}>
                                    {c.reviewStatus}{' '}
                                    {getStatusIcon(c.reviewStatus)}
                                </span>
                            }
                        </td>
                        <td>{c.slug ?? '-'}</td>
                        <td>{c.author.name}</td>
                        <td/>
                    </tr>
                )
            }
        </tbody>
    </table>;
}
