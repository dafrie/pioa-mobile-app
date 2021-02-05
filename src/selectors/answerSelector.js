import { createSelector } from "reselect";
import { createSelector as ormCreateSelector } from "redux-orm";
import { orm } from "../models";

// Select the state managed by Redux-
const ormSelector = state => state.orm;

//
export const answersByPatientIdSelector = createSelector(
  ormSelector,
  state => state.uiPatients.selectedPatientId,
  ormCreateSelector(orm, (session, selectedPatientId) => {
    const patient = session.Patient.withId(selectedPatientId);
    return patient.answers.toRefArray().map(answer => answer);
  })
);

export const answersByIdSelector = createSelector(
  ormSelector,
  state => state.uiPatients.selectedAnswerId,
  ormCreateSelector(orm, (session, selectedAnswerId) => {
    const answer = session.Answer.withId(selectedAnswerId);
    const obj = answer.ref;
    return JSON.parse(JSON.stringify(obj));
  })
);

export const getNumberOfPages = createSelector(
  ormSelector,
  state => state.uiPatients.selectedAnswerId,
  ormCreateSelector(orm, (session, selectedAnswerId) => {
    const answer = session.Answer.withId(selectedAnswerId);
    return {
      pageNumber: answer.pageNumber,
      numberOfPages: Object.keys(answer.pages).length
    };
  })
);

export const jsonByIdSelector = createSelector(
  ormSelector,
  state => state.uiPatients.selectedAnswerId,
  ormCreateSelector(orm, (session, selectedAnswerId) => {
    const answer = session.Answer.withId(selectedAnswerId);
    const json = session.Questionnaire.withId(answer.questionnaireExtId);
    return JSON.parse(JSON.stringify(json.schema));
  })
);
