import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { WebApps } from 'webapps-react';
import { ToastProvider } from 'react-toast-notifications';

import { Settings, SetWeek } from './components';

ReactDOM.render(
    <WebApps>
        <ToastProvider autoDismiss="true" autoDismissTimeout="3000">
            <BrowserRouter basename="/apps/TimetableWeek">
                <Switch>
                    <Route exact path="/" name="Set Week" component={SetWeek} />
                    <Route exact path="/settings" name="Settings" component={Settings} />
                </Switch>
            </BrowserRouter>
        </ToastProvider>
    </WebApps>,
    document.getElementById('WebApps_AppContainer')
);
