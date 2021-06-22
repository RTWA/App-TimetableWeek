import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { useToasts } from 'react-toast-notifications';
import { Button, Input, Loader, WebAppsContext } from 'webapps-react';

import Permissions from './Permissions';

axios.defaults.withCredentials = true;

const Settings = () => {
    const [state, setState] = useState('');
    const [current, setCurrent] = useState('loading');
    const [next, setNext] = useState('Not Set');
    const [active, setActive] = useState('0000-00-00 00:00:00');
    const [currentLabel, setCurrentLabel] = useState('');
    const [nextLabel, setNextLabel] = useState('');
    const [tab, setTab] = useState(0);

    const { UI } = useContext(WebAppsContext);
    const { addToast } = useToasts();

    useEffect(() => {
        axios.get('/api/apps/TimetableWeek/value.json')
            .then(json => {
                setCurrent(json.data.value.current);
                setNext(json.data.value.next);
                setActive(json.data.value.active);
                setCurrentLabel(json.data.value.labels.current);
                setNextLabel(json.data.value.labels.next);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });
    }, []);

    const setData = () => {
        setState('saving');

        let formData = new FormData();
        formData.append("current", current);
        formData.append("next", next);
        formData.append("active", active);
        formData.append("currentLabel", currentLabel);
        formData.append("nextLabel", nextLabel);

        axios.post('/api/apps/TimetableWeek/settings', formData)
            .then(json => {
                addToast("Settings Saved", { appearance: 'success'});
                
                setState('saved');
                setTimeout(() => {
                    setState('');
                }, 2500);
            })
            .catch(error => {
                addToast(error.response.data.message || "Failed to save! " + error.response.statusText, { appearance: 'error'});

                setState('error');
                setTimeout(() => {
                    setState('');
                }, 2500);
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
        (tab === id) ? `border-${UI.theme}-600` : '',
        (tab === id) ? `dark:border-${UI.theme}.300` : ''
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
        <div className="w-full px-4 py-6">
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
                    <p className="px-4 lg:px-10"><strong>Manually override the current and next values</strong></p>
                    <div className="flex flex-auto px-4 lg:px-10 pt-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="current">Current Value</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <Input type="text" name="current" id="current" value={current} onChange={handleChange} state={state} />
                        </div>
                    </div>
                    <div className="flex flex-auto px-4 lg:px-10 pt-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="next">Next Value</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <Input type="text" name="next" id="next" value={next} onChange={handleChange} state={state} />
                        </div>
                    </div>

                    <p className="px-4 lg:px-10 pt-10"><strong>Re-phrase the prefix text</strong></p>
                    <div className="flex flex-auto px-4 lg:px-10 pt-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="currentLabel">"This week" label</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <Input type="text" name="currentLabel" id="currentLabel" value={currentLabel} onChange={handleChange} state={state} />
                        </div>
                    </div>
                    <div className="flex flex-auto px-4 lg:px-10 pt-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="nextLabel">"Next week" label</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <Input type="text" name="nextLabel" id="nextLabel" value={nextLabel} onChange={handleChange} state={state} />
                        </div>
                    </div>

                    <p className="px-4 lg:px-10 pt-10"><strong>Change switchover date and time</strong></p>
                    <div className="flex flex-auto px-4 lg:px-10 pt-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="active">Switchover Date & Time</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <Input type="text" name="active" id="active" value={active} onChange={handleChange} state={state} />
                            <span className="text-xs text-gray-400">
                                Format must be YYYY-MM-DD HH:MM:SS<br />
                                The next value will be current at the time and date here.
                            </span>
                        </div>
                    </div>

                    <Button onClick={setData} style="outline">Save Settings</Button>
                </div>
                <div className={paneClass(1)}>
                    <Permissions />
                </div>
            </div>
        </div>
    )
}

export default Settings;