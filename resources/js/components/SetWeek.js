import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { APIClient, Button, Input, Loader, PageWrapper, useToasts } from 'webapps-react';

const SetWeek = () => {
    const [current, setCurrent] = useState('loading');
    const [next, setNext] = useState('Not Set');
    const [active, setActive] = useState('0000-00-00 00:00:00');
    const [custom, setCustom] = useState(null);
    const [settings, setSettings] = useState(false);

    const { addToast } = useToasts();

    const APIController = new AbortController();

    useEffect(async () => {
        await APIClient('/api/apps/TimetableWeek/value.json', undefined, { signal: APIController.signal })
            .then(json => {
                setCurrent(json.data.value.current);
                setNext(json.data.value.next);
                setActive(json.data.value.active);
                setSettings(json.data.value.settings);
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

    const setData = async value => {
        await APIClient('/api/apps/TimetableWeek/next', { next: JSON.stringify(value) }, { signal: APIController.signal })
            .then(json => {
                addToast(json.data.message, '', { appearance: 'success' });
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    addToast(error.response.data.message || "Failed to save!", error.response.statusText, { appearance: 'error' });
                }
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
                <>
                    <hr className="my-4" />
                    <Button to="/settings" type="outline" color="gray" className="inline-flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        App Settings
                    </Button>
                </>
            )
        }
    }

    if (current === 'loading') {
        return <Loader />
    }

    const _active = moment(active);
    return (
        <PageWrapper title="Timetable Week">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="overflow-hidden rounded shadow-lg bg-white dark:bg-gray-800 text-center p-4">
                    <h2 className="text-medium">The currently selected option is: <strong>{current}</strong></h2>
                    <h4 className="text-sm">The next selected option is: <strong>{next}</strong></h4>
                    <hr className="my-4" />
                    <p>The next option will be active
                        from {_active.format('ha')} on {_active.format('dddd Do MMMM Y')}</p>
                    {settingsBtn()}
                </div>

                <div className="rounded shadow-lg p-4 bg-white dark:bg-gray-800 ">
                    <div className="font-bold">Select the next option</div>
                    <div className="flex flex-row my-4">
                        <div className="flex-grow text-center">
                            <Button data-week="Week A" onClick={handleClick} type="outline">
                                Week A
                            </Button>
                        </div>
                        <div className="flex-grow text-center">
                            <Button data-week="Week B" onClick={handleClick} type="outline">
                                Week B
                            </Button>
                        </div>
                    </div>
                    <Input
                        name="custom_val"
                        id="custom_val"
                        label="Or set a custom option:"
                        type="text"
                        value={custom || ''}
                        onChange={handleChange}
                        action={
                            <Button type="ghost" color="gray" size="small" square
                                className="uppercase mr-1 w-full sm:w-auto sm:rounded-md"
                                onClick={saveCustom}>
                                Save
                            </Button>
                        } />
                </div>
            </div>
        </PageWrapper>
    );
}

export default SetWeek;