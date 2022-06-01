import React, { useEffect, useState, useContext } from 'react';
import classNames from 'classnames';
import { APIClient, Button, Input, Loader, PageWrapper, useToasts, WebAppsUXContext } from 'webapps-react';

import Permissions from './Permissions';

const Settings = () => {
    const [state, setState] = useState('');
    const [current, setCurrent] = useState('loading');
    const [next, setNext] = useState('Not Set');
    const [active, setActive] = useState('0000-00-00 00:00:00');
    const [currentLabel, setCurrentLabel] = useState('');
    const [nextLabel, setNextLabel] = useState('');
    const [tab, setTab] = useState(0);

    const { theme } = useContext(WebAppsUXContext);
    const { addToast } = useToasts();

    const APIController = new AbortController();

    useEffect(async () => {
        await APIClient('/api/apps/TimetableWeek/value.json', undefined, { signal: APIController.signal })
            .then(json => {
                setCurrent(json.data.value.current);
                setNext(json.data.value.next);
                setActive(json.data.value.active);
                setCurrentLabel(json.data.value.labels.current);
                setNextLabel(json.data.value.labels.next);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: Handle errors
                    console.log(error);
                }
            });

        return () => {
            APIController.abort()
        }
    }, []);

    const setData = async () => {
        setState('saving');

        await APIClient('/api/apps/TimetableWeek/settings',
            {
                current: current,
                next: next,
                active: active,
                currentLabel: currentLabel,
                nextLabel: nextLabel
            },
            {
                signal: APIController.signal
            })
            .then(json => {
                addToast("Settings Saved", '', { appearance: 'success' });

                setState('saved');
                setTimeout(() => {
                    setState('');
                }, 2500);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    addToast(error.response.data.message || "Failed to save!", error.response.statusText, { appearance: 'error' });

                    setState('error');
                    setTimeout(() => {
                        setState('');
                    }, 2500);
                }
            });
    }

    const handleChange = e => {
        let name = e.target.id;
        switch (name) {
            case "current":
                setCurrent(e.target.value);
                break;
            case "next":
                setNext(e.target.value);
                break;
            case "active":
                setActive(e.target.value);
                break;
            case "currentLabel":
                setCurrentLabel(e.target.value);
                break;
            case "nextLabel":
                setNextLabel(e.target.value);
                break;
        }
    }

    const tabClass = id => classNames(
        'text-gray-600',
        'dark:text-gray-200',
        'py-4',
        'px-6',
        'hover:text-gray-800',
        'dark:hover:text-white',
        'focus:outline-none',
        (tab === id) ? 'border-b-2' : '',
        (tab === id) ? 'font-medium' : '',
        (tab === id) ? `border-${theme}-600` : '',
        (tab === id) ? `dark:border-${theme}.300` : ''
    )

    const paneClass = id => classNames(
        'p-5',
        (tab === id) ? 'block' : 'hidden'
    )

    // render
    if (current === 'loading') {
        return <Loader />
    }

    return (
        <PageWrapper title="Timetable Week">
            <div className="flex flex-col min-w-0 break-words w-full mx-auto shadow bg-white dark:bg-gray-800 rounded">
                <nav className="flex flex-col sm:flex-row border-b border-gray-200 dark:border-gray-600">
                    <button className={tabClass(0)} onClick={() => setTab(0)}>
                        App Settings
                    </button>
                    <button className={tabClass(1)} onClick={() => setTab(1)}>
                        App Permissions
                    </button>
                </nav>
                <div className={paneClass(0)}>
                    <p className="font-bold mb-2">Manually override the current and next values</p>
                    <Input
                        type="text"
                        name="current"
                        id="current"
                        label="Current Value"
                        value={current}
                        onChange={handleChange}
                        state={state}
                    />
                    <Input
                        type="text"
                        name="next"
                        id="next"
                        label="Next Value"
                        value={next}
                        onChange={handleChange}
                        state={state}
                    />

                    <p className="font-bold mt-10 mb-2">Re-phrase the prefix text</p>
                    <Input
                        type="text"
                        name="currentLabel"
                        id="currentLabel"
                        label='"This week" label'
                        value={currentLabel}
                        onChange={handleChange}
                        state={state}
                    />
                    <Input
                        type="text"
                        name="nextLabel"
                        id="nextLabel"
                        label='"Next week" label'
                        value={nextLabel}
                        onChange={handleChange}
                        state={state}
                    />

                    <p className="font-bold mt-10 mb-2">Change switchover date and time</p>
                    <Input
                        type="text"
                        name="active"
                        id="active"
                        label="Switchover Date & Time"
                        value={active}
                        onChange={handleChange}
                        state={state}
                        helpText={
                            <>Format must be YYYY-MM-DD HH:MM:SS<br />
                                The next value will be current at the time and date here.</>
                        }
                    />

                    <Button onClick={setData} type="outline">Save Settings</Button>
                    <Button href="/api/apps/TimetableWeek/value.json" target="_blank" type="link" size="small" color="gray" className="ml-6">View API Endpoint</Button>
                </div>
                <div className={paneClass(1)}>
                    <Permissions />
                </div>
            </div>
        </PageWrapper>
    )
}

export default Settings;