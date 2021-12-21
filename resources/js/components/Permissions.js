import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader, Switch, UserSuggest } from 'webapps-react';

axios.defaults.withCredentials = true;

const Permissions = () => {
    const [groups, setGroups] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [permitted, setPermitted] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(async () => {
        await axios.get('/api/groups')
            .then(json => {
                setGroups(json.data.groups);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });
        await axios.get('/api/users')
            .then(json => {
                setUsers(json.data.users);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });


        let formData1 = new FormData();
        formData1.append('permission', 'app.TimetableWeek.%');

        await axios.post('/api/permissions/search', formData1)
            .then(json => {
                setPermissions(json.data.permissions);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });

        let formData = new FormData();
        formData.append('isLike', true);
        formData.append('permission', 'app.TimetableWeek.%');

        await axios.post('/api/permitted', formData)
            .then(json => {
                setPermitted(json.data.users);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });
    }, []);

    const handleChange = async e => {
        let group = e.target.dataset.group;
        let perm = e.target.dataset.perm;
        let user = e.target.dataset.user;

        if (group === undefined && user !== undefined) {
            let formData = new FormData();
            formData.append('user', user);
            formData.append('permission', perm);

            await axios.post('/api/permissions/user', formData)
                .then(json => {
                    let _permitted = [];
                    permitted.map(function (u,) { _permitted.push(u); });
                    _permitted.map(function (u, i) { if (u.id == user) _permitted[i] = json.data.user });
                    setPermitted(_permitted);
                })
                .catch(error => {
                    // TODO: Handle errors
                    console.log(error);
                });
        } else if (group !== undefined && user === undefined) {
            let formData = new FormData();
            formData.append('group', group);
            formData.append('permission', perm);

            await axios.post('/api/permissions/group', formData)
                .then(json => {
                    let _groups = [];
                    groups.map(function (g) { _groups.push(g); });
                    _groups.map(function (g, i) { if (g.id == group) _groups[i] = json.data.group });
                    setGroups(_group);
                })
                .catch(error => {
                    // TODO: Handle errors
                    console.log(error);
                });
        }
    }

    const checkState = (perm, x) => {
        return (x.permissions.some(item => perm.id === item.id));
    }

    const select = user => {
        let _permitted = [];
        permitted.map(function (u, i) {
            _permitted.push(u);
            if (u.id === user.id)
                return;
        });

        // const _permitted = permitted;
        user.permissions = [];
        delete user.roles;
        _permitted.push(user);
        setPermitted(_permitted);
    }


    // render
    if (permissions.length === 0 && groups.length === 0) {
        return <Loader />
    }

    return (
        <>
            <div className={`hidden lg:grid lg:grid-cols-${permissions.length + 1}`}>
                <div>&nbsp;</div>
                {
                    permissions.map(function (perm, i) {
                        return (
                            <h6 key={i} className="text-left font-semibold">{perm.title}</h6>
                        )
                    })
                }
            </div>
            {
                groups.map(function (group, gi) {
                    return (
                        <div key={gi} className={(gi % 2) ? `py-2 lg:grid lg:grid-cols-${permissions.length + 1} bg-gray-200 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-600 -mx-5 px-5` : `py-2 lg:grid lg:grid-cols-${permissions.length + 1}`}>
                            <h6 className="font-semibold lg:font-normal text-center lg:text-left">{group.name}</h6>
                            {
                                permissions.map(function (perm, pi) {
                                    return (
                                        <div key={pi} className="pl-5 lg:pl-0">
                                            <div className="lg:hidden">{perm.title}</div>
                                            <Switch checked={checkState(perm, group)}
                                                data-group={group.id}
                                                data-perm={perm.id}
                                                name={`${perm.id}-${group.id}`}
                                                onChange={handleChange} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
            <div className="py-2 bg-gray-300 dark:bg-gray-700 -mx-5 px-5">
                Add extra permissions for specified users...
            </div>
            {
                permitted.map(function (user, gi) {
                    return (
                        <div key={gi} className={(gi % 2) ? `py-2 lg:grid lg:grid-cols-${permissions.length + 1} bg-gray-200 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-600 -mx-5 px-5` : `py-2 lg:grid lg:grid-cols-${permissions.length + 1}`}>
                            <h6 className="font-semibold lg:font-normal text-center lg:text-left">{user.name}</h6>
                            {
                                permissions.map(function (perm, pi) {
                                    return (
                                        <div key={pi} className="pl-5 lg:pl-0">
                                            <div className="lg:hidden">{perm.title}</div>
                                            <Switch checked={checkState(perm, user)}
                                                data-user={user.id}
                                                data-perm={perm.id}
                                                onChange={handleChange} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
            <UserSuggest users={users} select={select} />
        </>
    );
}

export default Permissions;