import { createSelector } from 'redux-orm';
import { orm } from '../models';

// Select the state managed by Redux-
const dbStateSelector = state => state.orm;

export const questionnaireSelector = createSelector(
    orm,
    dbStateSelector,
    session => {
        return session.Questionnaire.all().toRefArray()
    }
);
