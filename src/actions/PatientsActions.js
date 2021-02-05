import _ from 'lodash';
import { getPatients, patientsSelector } from '../selectors';
import { store } from '../store';

import {
    TOGGLE_SEARCHBAR,
    TOGGLE_FILTERBAR,
    SEARCHTERM_CHANGE,
    SEARCHINDEX_CHANGE,
    FILTER_CHANGE,
    SORT_CHANGE,
    UPSERT_ENTITY,
    DELETE_PATIENT,
    SELECT_PATIENT,
    UNSELECT_PATIENT,
    LOAD_PATIENTS,
    PATIENTS_LOADED,
    PATIENTS_SYNCED,
    PATIENTS_CLEARED,
    SELECT_COMMENT,
    ADD_TO_QUEUE,
} from './types';

export const toggleSearchBar = () => {
 return ({
    type: TOGGLE_SEARCHBAR,
});
};

export const toggleFilterBar = () => {
 return ({
    type: TOGGLE_FILTERBAR,
}); 
};

export const changeSearchTerm = term => {
return ({
    type: SEARCHTERM_CHANGE,
    payload: term,
});
};

export const changeSearchIndex = term => {
 return ({
    type: SEARCHINDEX_CHANGE,
    payload: term,
});
};

export const changeFilter = term => {
 return ({
    type: FILTER_CHANGE,
    payload: term,
});
};

export const sortChange = term => {
return ({
    type: SORT_CHANGE,
    payload: term,
}); 
};

export const upsertEntity = (payload, entity) => {
 return ({
    type: UPSERT_ENTITY,
    payload,
    meta: { entity, sync: { entity } },
    // TODO: meta: { entity, sync: true }
}); 
};

export const deletePatient = payload => {
return ({
    type: DELETE_PATIENT,
    payload,
    meta: { sync: { entity: 'Patient' } },
});
};

export const selectPatient = payload => {
return ({
    type: SELECT_PATIENT,
    payload,
});
};

export const unselectPatient = () => {
 return ({
    type: UNSELECT_PATIENT,
}); 
};

export const selectComment = () => {
 return ({
    type: SELECT_COMMENT,
    payload: '',
});
};

export const clearData = () => {
 return async dispatch => {
    try {
        dispatch({ type: PATIENTS_CLEARED });
    } catch (e) {
        console.log(e);
    }
};
};

export const syncPatients = () => {
return async dispatch => {
    try {
        dispatch({ type: PATIENTS_SYNCED });
    } catch (e) {
        console.log(e);
    }
}; 
};

function syncUnsynced(entity, array, dispatch) {
    _.forEach(array, (i) => {
        const { id, extId = null, parentId = null } = i;
        dispatch({
            type: ADD_TO_QUEUE,
            payload: { entity, id, extId, parentId },
        });
    });
}

export const syncAllUnsynced = () => {
return async dispatch => {
    const state = store.getState();
    const settings = state.settings; // TODO: Discuss wethere here or in selector
    const patients = getPatients(state);

    // Loop through all patients and sync.
    _.forEach(patients, (p) => {
        // If required,add patient to queue first
        p.version !== p.extVersion
            ? dispatch({
                  type: ADD_TO_QUEUE,
                  payload: {
                      entity: 'Patient',
                      id: i.id,
                      extId: i.extId || null,
                      parentId: null,
                  },
              })
            : null;
        settings.syncComments ? syncUnsynced('Comment', p.unsyncedObjects.comments, dispatch) : null;
        settings.syncAttachments ? syncUnsynced('Attachment', p.unsyncedObjects.attachments, dispatch) : null;
        syncUnsynced('Answer', p.unsyncedObjects.answers);
    });
};
};
