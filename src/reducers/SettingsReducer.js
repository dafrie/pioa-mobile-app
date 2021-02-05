import {
    UPDATE_SETTINGS,
} from '../actions/types';

const INITIAL_STATE = {
    lang: 'en',
    dateFormat: 'YYYY-MM-DD',
    showStatusBar: false,
    autoSync: true, // "Off" // Automatically add all new/changed entities to the sync queue
    syncSwitch: true, // If on, attempt to sync all items in the queue
    autoSyncMode: 'w_and_c', // Wifi + Cellular
    syncAttachments: true, // Can be overwritten per patient...
    syncComments: true, // Can be overwritten per patient...
    useCellular: true, // General option, effective also for manual sync.
    useExpensiveConnection: true, // Experimental setting, for android only...
};


export default (state = INITIAL_STATE, action) => {
    const {type, payload} = action;
    switch (type) {
        case UPDATE_SETTINGS:
            return {...state, [payload.setting]: payload.value};
        default:
            return state;
    }
};
