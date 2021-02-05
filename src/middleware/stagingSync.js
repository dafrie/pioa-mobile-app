import _ from 'lodash';

import {syncData} from '../utils/backgroundJob';

import {
    ADD_TO_QUEUE,
    REMOVE_FROM_QUEUE,
} from '../actions/types';


// Checks settings if entity requires autosync or not. Returns boolean if sync required or not
function checkSyncSettings(store, entity) {
    const state = store.getState();
    const {autoSync, syncAttachments, syncComments} = state.settings;
    if (!autoSync) {
        return false;
    } else if (!syncAttachments && entity === 'Attachment') {
        return false
    } else if (!syncComments && entity === 'Comment') {
        return false
    }
    return true
}


function deleteEntityCheck(store, state, item) {
    // Remove create/edit entries from queue as these are unsynced with backend.
    // Remove child elements of "patient" from queue
    // Return item if element is synced already, otherwise return null
    const queue = state.syncQueue.queue;
    const {entity, id, extId, parentId} = item;

    if (_.some(queue, item)) {
        // Dispatch action to remove the other entries of that object in the queue
        store.dispatch({type: REMOVE_FROM_QUEUE, payload: {entity, id, extId, parentId}});
    }
    // Remove all (or will be...) orphaned child elements from queue
    if (entity === 'Patient') {
        const orphans = _.filter(queue, ['parentId', id]);
        _.forEach(orphans, (orphan) => {
            store.dispatch({type: REMOVE_FROM_QUEUE, payload: orphan})
        });
    }

    // If no external Id set, then the item was not synced yet and no delete action is required
    if (!extId) {
        return null
    }
    // Return "delete" entry into queue
    return {id: null, extId, parentId}
}


export const stagingSync = store => next => action => {
    // Skip if no meta sync tag set
    if (!action || !action.meta || !action.meta.sync) {
        return next(action);
    }
    const {entity} = action.meta.sync;

    const {patient = null} = action.payload;
    const {id, extId = null, patientId: parentId = patient} = action.payload;

    // Skip if settings say so (autosync, attachments, comments...)
    const syncEntity = checkSyncSettings(store, entity);
    if (!syncEntity) {
        return next(action)
    }

    const previousState = store.getState();
    const result = next(action);
    const newState = store.getState();
    let items = [];
    let diff = [];

    // If id is not undefined, then the entity does already exist in the redux-orm store.
    // Thus it must either be an UPDATE or DELETE
    if (typeof (action.payload.id) !== 'undefined') {
        // Calculate difference between previous and new state
        diff = _.difference(previousState.orm[entity].items, newState.orm[entity].items);

        // EDIT: If no difference must be edit
        if (!diff.length) {
            items = [{id, extId, parentId}];
        } else {
            // DELETE: If difference, then must be delete
            _.reduce(diff, function (items, id) {
                const queueItem = {entity, id, extId, parentId};
                // Remove create/edit entries from queue. Return item if element is synced already, otherwise return null
                const res = deleteEntityCheck(store, previousState, queueItem);
                if (res) {
                    items.push(res)
                }
                return items;
            }, items);
        }
    } else {
        // CREATE: 3. option can only be creation: Thus switch the calculated difference between new and previous state.
        diff = _.difference(newState.orm[entity].items, previousState.orm[entity].items);
        items = diff.map((id) => ({id, extId: null, parentId: parentId}));
    }
    // For each item, dispatch the add queue action
    _.forEach(items, (item) => {
            const {id, extId, parentId} = item;
            store.dispatch({type: ADD_TO_QUEUE, payload: {entity, id, extId, parentId}});
        }
    );
    syncData();
    return result;
};

export const logger = store => next => action => {
    let result = next(action);
    return result;
};

export const crashReporter = store => next => action => {
    try {
        return next(action);
    } catch (e) {
        console.error('Caught an exception!', e);
        throw e;
    }
};
