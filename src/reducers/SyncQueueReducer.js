import _ from 'lodash';

import {
    ADD_TO_QUEUE,
    REMOVE_FROM_QUEUE,
    CLEAR_QUEUE,
    START_UPLOADING,
    UPDATE_PROGRESS,
    FINISH_UPLOADING
} from '../actions/types';

const INITIAL_STATE = {
    queue: [],
    uploading: false,
    progress: null,
    total: null
};

export default (state = INITIAL_STATE, action) => {
    const {payload, type} = action;
    switch (type) {
        case ADD_TO_QUEUE:
            // Do not update state if the exact same queue action is already contained within the queue
            if (_.some(state.queue, payload)) {
                return state;
            } return {...state, queue: [...state.queue, payload]};
        case REMOVE_FROM_QUEUE:
            // Keep all entries that are not equal to the payload
            const remaining = _.filter(state.queue, function (item) {
                const res = _.isEqual(item, payload);
                return !res
            });
            return {...state, queue: remaining};
        case CLEAR_QUEUE:
            return {...state, queue: [], uploading: false};
        case START_UPLOADING:
            return {...state, uploading: true };
        case UPDATE_PROGRESS:
            return {...state, loaded: payload.loaded, total: payload.total};
        case FINISH_UPLOADING:
            return {...state, uploading: false, loaded: null, total: null};
        default:
            return state;
    }
};
