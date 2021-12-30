import {useAdminUsers} from "../../hooks/use-admin-users";
import {Role, roles, UserDocument} from "../../model/UserDocument";
import {KeyboardEvent, MouseEvent} from "react";


export function ChronicleTable() {
    const {user, isLoading, error, users, updateRole} = useAdminUsers();
    const handleToggleRole = (user: UserDocument, role: Role) => (e: MouseEvent | KeyboardEvent) => {
        e.preventDefault();
        updateRole(user, role, !user.roles.includes(role))
    }

    if (!user || isLoading) {
        return <div className="callout secondary">
            Loading ...
        </div>
    }

    if (error) {
        return <div className="callout alert">
            There was an error loading the users: {error}
        </div>
    }

    return <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th/>
            </tr>
        </thead>
        <tbody>
            {users.sort((a, b) => a.name.localeCompare(b.name))
                .map(u =>
                    <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                            <div className="button-group small">
                                {roles().map(r => {
                                    const className =
                                        `button ${u.roles.includes(r) ? 'primary' : 'secondary hollow'}`;
                                    return <button key={r}
                                                   onClick={handleToggleRole(u, r)}
                                                   onKeyPress={handleToggleRole(u, r)}
                                                   className={className}>{r}</button
                                    >
                                })}
                            </div>
                        </td>
                        <td/>
                    </tr>
                )
            }
        </tbody>
    </table>;
}
