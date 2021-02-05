// NavigationService.js

import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

async function navigate(routeName, params) {
    try {await _navigator.dispatch(
        NavigationActions.navigate({
            type: NavigationActions.NAVIGATE,
            routeName,
            params,
        })
    );
    } catch (e) {
        console.log(e.message);
    }
}

// add other navigation functions that you need and export them

export default {
    navigate,
    setTopLevelNavigator,
};