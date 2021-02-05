// Special for toggling activity indicator
export const LOADING = 'loading';
export const READY = 'ready';
export const DISPLAY_WARNING = 'display_warning';

// Authentifcation
export const CHECK_TOKEN = 'check_token';
export const NO_TOKEN = 'no_token';
export const REFRESH_TOKEN = 'refresh_token';
export const GREETED = 'greeted';
export const EMAIL_CHANGED = 'email_changed';
export const PASSWORD_CHANGED = 'password_changed';
export const LOGIN_USER = 'login_user';
export const LOGIN_USER_SUCCESS = 'login_user_success';
export const LOGIN_USER_FAIL = 'login_user_fail';
export const LOGOUT_USER = 'logout_user';
export const PURGE_STATE = 'purge_state';
export const CHANGE_PASSWORD = 'change_password';

// Settings
export const UPDATE_SETTINGS = 'update_settings';
// Patients (List)
export const TOGGLE_SEARCHBAR = 'toggle_searchbar';
export const TOGGLE_FILTERBAR = 'toggle_filterbar';
export const SEARCHTERM_CHANGE = 'searchterm_change';
export const SEARCHINDEX_CHANGE = 'searchindex_change';
export const FILTER_CHANGE = 'filter_change';
export const SORT_CHANGE = 'sort_change';
export const UPSERT_ENTITY = 'upsert_entity';
export const DELETE_ENTITY = 'delete_entity';
export const UPDATE_VERSION = 'update_version';
export const DELETE_PATIENT = 'delete_patient';
export const SELECT_PATIENT = 'select_patient';
export const UNSELECT_PATIENT = 'unselect_patient';

export const PATIENTS_LOADED = 'patients_loaded';
export const SYNC_PATIENTS = 'sync_patients';
export const PATIENTS_SYNCED = 'patients_synced';
export const PATIENTS_CLEARED = 'patients_cleared';

// Answers
export const UPDATE_ANSWER = 'update_answer';
export const REMOVE_ANSWER = 'remove_answer';
export const SET_SELECTED_ANSWER = 'set_selected_answer';
export const UPDATE_QUESTIONNAIRES = 'updateQuestionnaires';


// Individual patients
export const ADD_ATTACHMENT = 'add_attachment';
export const REMOVE_ATTACHMENT = 'remove_attachment';
export const ADD_COMMENT = 'add_comment';
export const REMOVE_COMMENT = 'remove_comment';

// Sync Queue
export const ADD_TO_QUEUE = 'add_to_queue';
export const REMOVE_FROM_QUEUE = 'remove_from_queue';
export const CLEAR_QUEUE = 'clear_queue';
export const START_UPLOADING = 'start_uploading';
export const UPDATE_PROGRESS = 'update_progress';
export const FINISH_UPLOADING = 'finish_uploading';
