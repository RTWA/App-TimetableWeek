import React, { useEffect, useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';

import Permissions from './Permissions';

axios.defaults.withCredentials = true;

const Settings = () => {
    const [current, setCurrent] = useState('loading');
    const [next, setNext] = useState('Not Set');
    const [active, setActive] = useState('0000-00-00 00:00:00');
    const [currentLabel, setCurrentLabel] = useState('');
    const [nextLabel, setNextLabel] = useState('');
    const [tab, setTab] = useState(0);

    useEffect(() => {
        axios.get('/api/apps/TimetableWeek/value.json')
            .then(response => {
                return response;
            })
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
        // TODO: toasts
        // let save = toast("Saving changes, please wait...", {autoClose: false});

        let formData = new FormData();
        formData.append("current", current);
        formData.append("next", next);
        formData.append("active", active);
        formData.append("currentLabel", currentLabel);
        formData.append("nextLabel", nextLabel);

        axios.post('/api/apps/TimetableWeek/settings', formData)
            .then(response => {
                return response;
            })
            .then(json => {
                // TODO: toasts
                // TODO: message is not sent
                //toast.update(save, {type: toast.TYPE.SUCCESS, autoClose: 3000, render: json.data.message});
                alert(json.data.message);
            })
            .catch(error => {
                // TODO: toasts
                // toast.update(save, {
                //     type: toast.TYPE.ERROR,
                //     autoClose: 5000,
                //     render: error.response.data.message || "Failed to save! " + error.response.statusText
                // });
                alert(error.response.data.message || "Failed to save! " + error.response.statusText);
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
        (tab === id) ? 'border-indigo-600' : '',
        (tab === id) ? 'dark:border-indigo:300' : ''
    )

    const paneClass = id => classNames(
        'p-5',
        (tab === id) ? 'block' : 'hidden'
    )

    // render
    if (current === 'loading') {
        return <div>Loading...</div>
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
                            <input type="text" name="current" id="current" className="input-field" value={current} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="flex flex-auto px-4 lg:px-10 pt-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="next">Next Value</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <input type="text" name="next" id="next" className="input-field" value={next} onChange={handleChange} />
                        </div>
                    </div>

                    <p className="px-4 lg:px-10 pt-10"><strong>Re-phrase the prefix text</strong></p>
                    <div className="flex flex-auto px-4 lg:px-10 pt-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="currentLabel">"This week" label</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <input type="text" name="currentLabel" id="currentLabel" className="input-field" value={currentLabel} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="flex flex-auto px-4 lg:px-10 pt-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="nextLabel">"Next week" label</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <input type="text" name="nextLabel" id="nextLabel" className="input-field" value={nextLabel} onChange={handleChange} />
                        </div>
                    </div>

                    <p className="px-4 lg:px-10 pt-10"><strong>Change switchover date and time</strong></p>
                    <div className="flex flex-auto px-4 lg:px-10 pt-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="active">Switchover Date & Time</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <input type="text" name="active" id="active" className="input-field" value={active} onChange={handleChange} />
                            <span className="text-xs text-gray-400">
                                Format must be YYYY-MM-DD HH:MM:SS<br />
                                The next value will be current at the time and date here.
                            </span>
                        </div>
                    </div>

                    <a href="#" onClick={setData}
                        className="mx-4 lg:mx-10 px-4 py-2 border border-indigo-600 dark:border-indigo-300 hover:bg-indigo-600 dark:hover:bg-indigo-300 
                            text-indigo-600 dark:text-indigo-300 hover:text-white dark:hover:text-black">
                        Save Settings</a>
                </div>
                <div className={paneClass(1)}>
                    <Permissions />
                </div>
            </div>
        </div>
    )
}

export default Settings;