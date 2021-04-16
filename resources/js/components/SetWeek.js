import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

axios.defaults.withCredentials = true;

const SetWeek = () => {
    const [current, setCurrent] = useState('loading');
    const [next, setNext] = useState('Not Set');
    const [active, setActive] = useState('0000-00-00 00:00:00');
    const [custom, setCustom] = useState(null);
    const [settings, setSettings] = useState(false);

    useEffect(() => {
        axios.get('/api/apps/TimetableWeek/value.json')
            .then(response => {
                return response;
            })
            .then(json => {
                setCurrent(json.data.value.current);
                setNext(json.data.value.next);
                setActive(json.data.value.active);
                setSettings(json.data.value.settings);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });
    }, []);

    const setData = value => {
        // TODO: toasts
        // let save = toast("Setting selected option, please wait...", {autoClose: false});

        let formData = new FormData();
        formData.append("next", JSON.stringify(value));

        axios.post('/api/apps/TimetableWeek/next', formData)
            .then(response => {
                return response;
            })
            .then(json => {
                // TODO: toasts
                //toast.update(save, {type: toast.TYPE.SUCCESS, autoClose: 3000, render: json.data.message});
                alert(json.data.message);
            })
            .catch(error => {
                // TODO: toasts
                toast.update(save, {
                    type: toast.TYPE.ERROR,
                    autoClose: 5000,
                    render: error.response.data.message || "Failed to save! " + error.response.statusText
                });
            });
    }

    const handleClick = e => {
        e.preventDefault();
        setNext(e.target.dataset.week);
        setData(e.target.dataset.week);
    }

    const handleChange = e => {
        setCustom(e.target.value);
    }

    const saveCustom = () => {
        setNext(custom);
        setData(custom);
    }

    const settingsBtn = () => {
        if (settings) {
            return (
                <div>
                    <hr className="my-4" />
                    <Link to="/settings"
                        className="px-4 py-2 border border-indigo-600 dark:border-indigo-300 hover:bg-indigo-600 dark:hover:bg-indigo-300 
                          text-indigo-600 dark:text-indigo-300 hover:text-white dark:hover:text-black float-left">
                        <FontAwesomeIcon icon={['fas', 'cog']} className="mr-1" />
                        App Settings
                    </Link>
                </div>
            )
        }
    }

    // render
    if (current === 'loading') {
        return <div>Loading...</div>
    }

    const _active = moment(active);
    return (
        <div className="grid grid-cols-2">
            <div className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 border-indigo-600 dark:border-indigo-300 border-t-2 text-center mx-12 p-4">
                <div>
                    <h2 className="text-medium">The currently selected option is: <strong>{current}</strong></h2>
                    <h4 className="text-sm">The next selected option is: <strong>{next}</strong></h4>
                    <hr className="my-4" />
                    <p>The next option will be active
                                from {_active.format('ha')} on {_active.format('dddd Do MMMM Y')}</p>
                    {settingsBtn()}
                </div>
            </div>

            <div>
                <div className="rounded-lg shadow-lg border border-indigo-600 dark:border-indigo-300 mx-12 p-4 bg-white dark:bg-gray-800 ">
                    <div className="text-indigo-600 dark:text-indigo-300"><strong>Select the next option</strong></div>
                    <div className="text-center">
                        <div className="flex flex-row mt-4">
                            <div className="flex-grow text-center">
                                <a href="#" data-week="Week A" onClick={handleClick}
                                    className="px-4 py-2 border border-indigo-600 dark:border-indigo-300 hover:bg-indigo-600 dark:hover:bg-indigo-300 
                                                text-indigo-600 dark:text-indigo-300 hover:text-white dark:hover:text-black">
                                    Week A
                                </a>
                            </div>
                            <div className="flex-grow text-center">
                                <a href="#" data-week="Week B" onClick={handleClick}
                                    className="px-4 py-2 border border-indigo-600 dark:border-indigo-300 hover:bg-indigo-600 dark:hover:bg-indigo-300 
                                                text-indigo-600 dark:text-indigo-300 hover:text-white dark:hover:text-black">
                                    Week B
                                </a>
                            </div>
                        </div>
                        <div className="flex flex-row mt-8">
                            <div className="flex-grow pt-2">
                                Or set a custom option:
                            </div>
                            <div className="flex-grow relative">
                                <input type="text" className="input-field" value={custom || ''} onChange={handleChange} />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    <a href="#" onClick={saveCustom}
                                        className="font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none mr-1 ease-linear transition-all duration-150
                                        text-indigo-600 hover:text-white dark:text-indigo-300 dark:hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-300">
                                        Save
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetWeek;