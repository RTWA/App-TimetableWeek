import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AppPage, WebAppsUX } from 'webapps-react';

import { Settings, SetWeek } from './components';

ReactDOM.render(
    <WebAppsUX>
        <AppPage>
            <BrowserRouter basename="/apps/TimetableWeek">
                <Switch>
                    <Route exact path="/" name="Set Week" component={SetWeek} />
                    <Route exact path="/settings" name="Settings" component={Settings} />
                </Switch>
            </BrowserRouter>
        </AppPage>
    </WebAppsUX>,
    document.getElementById('WebApps_AppContainer')
);
