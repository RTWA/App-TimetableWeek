import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Settings, SetWeek } from './components';

ReactDOM.render(
    <BrowserRouter basename="/apps/TimetableWeek">
        <Switch>
            <Route exact path="/" name="Set Week" component={SetWeek} />
            <Route exact path="/settings" name="Settings" component={Settings} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('WebApps_AppContainer')
);
