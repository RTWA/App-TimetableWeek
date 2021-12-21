import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { WebApps } from 'webapps-react';

import { Settings, SetWeek } from './components';

ReactDOM.render(
    <WebApps>
        <BrowserRouter basename="/apps/TimetableWeek">
            <Switch>
                <Route exact path="/" name="Set Week" component={SetWeek} />
                <Route exact path="/settings" name="Settings" component={Settings} />
            </Switch>
        </BrowserRouter>
    </WebApps>,
    document.getElementById('WebApps_AppContainer')
);
