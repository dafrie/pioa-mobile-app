import _ from 'lodash';
import { createSelector } from 'reselect';
import { createSelector as ormCreateSelector } from 'redux-orm';
import { orm } from '../models';

// Select the state managed by Redux-ORM
const ormSelector = state => state.orm;

export const patientByIdSelector = createSelector(
    ormSelector,
    state => state.uiPatients.selectedPatientId,
    ormCreateSelector(orm, (session, selectedPatientId) => {
        if (typeof selectedPatientId !== 'undefined' && selectedPatientId != null) {
            const patient = session.Patient.withId(selectedPatientId);
            const obj = patient.ref;
            return Object.assign({}, obj, {
                comments: patient.comments.toRefArray().map(comment => comment),
                attachments: patient.attachments.toRefArray().map(attachment => attachment)
            });
        }
        return null
    })
);
