import {syncData} from '../utils/backgroundJob';

import {
    UPDATE_SETTINGS,
    CLEAR_QUEUE,
} from './types';


export const updateSettings = (setting) => async dispatch => {
    await dispatch({
        type: UPDATE_SETTINGS,
        payload: setting
    });
    syncData();
};

export const clearQueue = () => ({
    type: CLEAR_QUEUE,
});