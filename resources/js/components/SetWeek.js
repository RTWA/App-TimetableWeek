import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import { Button, Input, Loader, withWebApps } from 'webapps-react';

axios.defaults.withCredentials = true;

const SetWeek = ({ UI }) => {
    const [current, setCurrent] = useState('loading');
    const [next, setNext] = useState('Not Set');
    const [active, setActive] = useState('0000-00-00 00:00:00');
    const [custom, setCustom] = useState(null);
    const [settings, setSettings] = useState(false);

    const { addToast } = useToasts();

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

        let formData = new FormData();
        formData.append("next", JSON.stringify(value));

        axios.post('/api/apps/TimetableWeek/next', formData)
            .then(response => {
                return response;
            })
            .then(json => {
                addToast(json.data.message, { appearance: 'success' });
            })
            .catch(error => {
                addToast(error.response.data.message || "Failed to save! " + error.response.statusText, { appearance: 'error' });
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
                    <Button to="/settings" style="outline" color="gray" className="float-left flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        App Settings
                    </Button>
                </div>
            )
        }
    }

    if (current === 'loading') {
        return <Loader />
    }

    const _active = moment(active);
    return (
        <div className="grid grid-cols-2">
            <div className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 text-center mx-12 p-4">
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
                <div className="rounded-lg shadow-lg mx-12 p-4 bg-white dark:bg-gray-800 ">
                    <div className={`text-${UI.theme}-600 dark:text-${UI.theme}-300`}><strong>Select the next option</strong></div>
                    <div className="text-center">
                        <div className="flex flex-row mt-4">
                            <div className="flex-grow text-center">
                                <Button data-week="Week A" onClick={handleClick} style="outline">
                                    Week A
                                </Button>
                            </div>
                            <div className="flex-grow text-center">
                                <Button data-week="Week B" onClick={handleClick} style="outline">
                                    Week B
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-row mt-8">
                            <div className="flex-grow pt-2">
                                Or set a custom option:
                            </div>
                            <div className="flex-grow relative">
                                <Input type="text" value={custom || ''} onChange={handleChange} />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    <Button onClick={saveCustom} color="gray" style="ghost" size="small">Save</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withWebApps(SetWeek);