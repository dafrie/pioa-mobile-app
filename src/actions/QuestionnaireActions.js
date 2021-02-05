import {
    REMOVE_ANSWER,
    UPDATE_QUESTIONNAIRES,
    SET_SELECTED_ANSWER,
    UPSERT_ENTITY,
    UPDATE_ANSWER,
} from './types';

import json from '../components/questionnaire-builder/trauma.json';

export const addAnswer = payload => async dispatch => {
    try {
        const { questionnaire, patientId } = payload;

        let pages = {};
        for (const [index, page] of questionnaire.schema.pages.entries()) {
            let cards = {};
            for (const [i, card] of page.cards.entries()) {
                cards[card.id] = [{}];
            }
            pages[page.id] = cards;
        }

        const answer = {
            patient: patientId,
            questionnaireId: payload.questionnaireId,
            pageNumber: 0,
            pageKnown: 0,
            firstTime: true,
            date: Date.now(),
            type: questionnaire.type,
            questionnaireExtId: questionnaire.extId,
            questionnaire_uuid: questionnaire.extId,
            numberOfPages: questionnaire.numberOfPages,
            numberOfQuestions: questionnaire.numberOfQuestions,
            version: 0,
            pages: [],
        };

        answer.pages = pages;

        dispatch({
            type: UPSERT_ENTITY,
            payload: answer,
            meta: { entity: 'Answer' },
        });
    } catch (e) {
        console.log(e);
    }
};

export const removeAnswer = payload => async dispatch => {
    try {
        dispatch({
            type: REMOVE_ANSWER,
            payload,
            meta: { entity: 'Answer' },
        });
    } catch (e) {
        console.log(e);
    }
};

export const updateAnswer = payload => async dispatch => {
    try {
        dispatch({
            type: UPDATE_ANSWER,
            payload,
            meta: { entity: 'Answer' },
        });
    } catch (e) {
        console.log(e);
    }
};

export const confirmAnswer = payload => async dispatch => {
    try {
        dispatch({
            type: UPSERT_ENTITY,
            payload,
            meta: { entity: 'Answer', sync: { entity: 'Answer' } },
        });
    } catch (e) {
        console.log(e);
    }
};

export const setSelectedAnswer = payload => async dispatch => {
    try {
        dispatch({ type: SET_SELECTED_ANSWER, payload });
    } catch (e) {
        console.log(e);
    }
};

export const updateQuestionnaires = payload => dispatch => {
    try {
        dispatch({
            type: UPDATE_QUESTIONNAIRES,
            payload: payload,
        });
    } catch (e) {
        console.log(e);
    }
};
