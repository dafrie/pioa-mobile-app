import {
    TOGGLE_SEARCHBAR,
    TOGGLE_FILTERBAR,
    SEARCHTERM_CHANGE,
    SEARCHINDEX_CHANGE,
    FILTER_CHANGE,
    SORT_CHANGE,
    LOAD_PATIENTS,
    PATIENTS_LOADED,
    SYNC_PATIENTS,
    PATIENTS_SYNCED,
    PATIENTS_CLEARED,
    SELECT_PATIENT,
    UNSELECT_PATIENT,
    SET_SELECTED_ANSWER
} from '../actions/types';

const INITIAL_STATE = {
    showSearchBar: false,
    showFilterBar: false,
    searchFilter: 'SEARCH_ALL',
    visibilityFilter: 'SHOW_ALL',
    sortSelection: null,
    selectedPatientId: null,
    selectedAnswerId: null
};

export default (state = INITIAL_STATE, action) => {
    const {payload} = action;
    switch (action.type) {
        case TOGGLE_SEARCHBAR:
            return {...state, showSearchBar: !state.showSearchBar};
        case TOGGLE_FILTERBAR:
            return {...state, showFilterBar: !state.showFilterBar};
        case SEARCHTERM_CHANGE:
            return {...state, searchTerm: payload};
        case SEARCHINDEX_CHANGE:
            return {...state, searchFilter: payload};
        case FILTER_CHANGE:
            return {...state, visibilityFilter: payload};
        case SORT_CHANGE:
            return {...state, sortSelection: payload};
        case LOAD_PATIENTS:
            return {...state, patients: []};
        case PATIENTS_LOADED:
            return {...state, patients: payload};
        case SYNC_PATIENTS:
            return {...state, patients: []};
        case PATIENTS_SYNCED:
            return {...state, patients: payload};
        case PATIENTS_CLEARED:
            return {...state, patients: []};
        case SELECT_PATIENT:
            const { id } = payload;
            return {...state, selectedPatientId: id};
        case UNSELECT_PATIENT:
            return {...state, selectedPatientId: null, selectedAnswerId: null};
        case SET_SELECTED_ANSWER:
            return {...state, selectedAnswerId: payload.answerId};
        default:
            return state;
    }
};
