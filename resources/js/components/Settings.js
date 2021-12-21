import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { Button, Input, Loader, useToasts, WebAppsContext } from 'webapps-react';

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

    useEffect(async () => {
        await axios.get('/api/apps/TimetableWeek/value.json')
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

    const setData = async () => {
        setState('saving');

        let formData = new FormData();
        formData.append("current", current);
        formData.append("next", next);
        formData.append("active", active);
        formData.append("currentLabel", currentLabel);
        formData.append("nextLabel", nextLabel);

        await axios.post('/api/apps/TimetableWeek/settings', formData)
            .then(json => {
                addToast("Settings Saved", '', { appearance: 'success' });

                setState('saved');
                setTimeout(() => {
                    setState('');
                }, 2500);
            })
            .catch(error => {
                addToast(error.response.data.message || "Failed to save!", error.response.statusText, { appearance: 'error' });

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
                <p className="font-bold">Manually override the current and next values</p>
                <div className="w-full sm:w-6/12 flex flex-col xl:flex-row items-center py-1">
                    <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="current">Current Value</label>
                    <Input type="text" name="current" id="current" value={current} onChange={handleChange} state={state} />
                </div>
                <div className="w-full sm:w-6/12 flex flex-col xl:flex-row items-center py-1">
                    <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="next">Next Value</label>
                    <Input type="text" name="next" id="next" value={next} onChange={handleChange} state={state} />
                </div>

                <p className="font-bold mt-10">Re-phrase the prefix text</p>
                <div className="w-full sm:w-6/12 flex flex-col xl:flex-row items-center py-1">
                    <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="currentLabel">"This week" label</label>
                    <Input type="text" name="currentLabel" id="currentLabel" value={currentLabel} onChange={handleChange} state={state} />
                </div>
                <div className="w-full sm:w-6/12 flex flex-col xl:flex-row items-center py-1">
                    <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="nextLabel">"Next week" label</label>
                    <Input type="text" name="nextLabel" id="nextLabel" value={nextLabel} onChange={handleChange} state={state} />
                </div>

                <p className="font-bold mt-10">Change switchover date and time</p>
                <div className="w-full sm:w-6/12 flex flex-col xl:flex-row py-1">
                    <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="active">Switchover Date & Time</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none mt-1 xl:mt-0 w-full">
                        <Input type="text" name="active" id="active" value={active} onChange={handleChange} state={state} />
                        <div className="text-xs text-gray-400 dark:text-gray-200">
                            Format must be YYYY-MM-DD HH:MM:SS<br />
                            The next value will be current at the time and date here.
                        </div>
                    </div>
                </div>

                <Button onClick={setData} style="outline">Save Settings</Button>
            </div>
            <div className={paneClass(1)}>
                <Permissions />
            </div>
        </div>
    )
}

export default Settings;