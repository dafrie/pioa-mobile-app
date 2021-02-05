import {
    CHECK_TOKEN,
    NO_TOKEN,
    REFRESH_TOKEN,
    GREETED,
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGOUT_USER, DISPLAY_WARNING
} from '../actions/types';

const INITIAL_STATE = {
    loggedIn: false,
    user: null,
    error: '',
    emailValue: '',
    passwordValue: '',
    greeted: false,
    warning: ''
};


export default (state = INITIAL_STATE, action) => {
    const {type, payload} = action;
    switch (type) {
        case CHECK_TOKEN:
            return {...state, error: ''};
        case NO_TOKEN:
            return {...state, user: null, loggedIn: false};
        case GREETED:
            return {...state, greeted: true, user: {...state.user, greeted: true}};
        case EMAIL_CHANGED:
            // Create new (copied) state object with all properties and update the email property
            return {...state, emailValue: payload};
        case PASSWORD_CHANGED:
            return {...state, passwordValue: payload};
        case LOGIN_USER:
            return {...state, error: '', warning: ''};
        case LOGOUT_USER:
            return {
                ...state,
                loggedIn: false,
                greeted: state.greeted,
                user: null,
                error: '',
                emailValue: '',
                passwordValue: '',
                warning: ''
            };
        case REFRESH_TOKEN:
            return {
                ...state,
                user: {
                    ...state.user,
                    email: payload.user.email,
                    firstName: payload.user.firstName,
                    lastName: payload.user.lastName,
                    idToken: payload.user.idToken,
                    expiresAt: payload.user.expiresAt
                }
            }
        case LOGIN_USER_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                user: {
                    ...state.user,
                    email: payload.user.email,
                    firstName: payload.user.firstName,
                    lastName: payload.user.lastName,
                    idToken: payload.user.idToken,
                    refreshToken: payload.user.refreshToken,
                    expiresAt: payload.user.expiresAt
                },
                emailValue: '',
                passwordValue: '',
                warning: '',
                error: ''
            };
        case LOGIN_USER_FAIL:
            return {
                ...state,
                loggedIn: false,
                user: null,
                error: payload,
                warning: payload,
                passwordValue: '',
            };
        case DISPLAY_WARNING:
            return {
                ...state,
                warning: payload
            };
        default:
            return state;
    }
};
