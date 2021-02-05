import _ from 'lodash';
import { createSelector } from 'reselect';
import { createSelector as ormCreateSelector } from 'redux-orm';
import { orm } from '../models';

// Select the state managed by Redux-
const ormSelector = state => {
  return state.orm;
};

export const getPatients = state => {
  return patientsSelector(state);
};

const getSearchTerm = state => {
  return state.uiPatients.searchTerm;
};
const getSearchFilter = state => {
  return state.uiPatients.searchFilter;
};
const getVisibilityFilter = state => {
  return state.uiPatients.visibilityFilter;
};
const getSortSelection = state => {
  return state.uiPatients.sortSelection;
};
const getSortDirection = state => {
  return state.uiPatients.sortDirection;
};

const getSyncQueue = state => {
  return state.syncQueue.queue;
};

export const patientsSelector = ormCreateSelector(
  orm,
  // The first input selector should always select the db-state.
  // Behind the scenes, `createSelector` begins a Redux-ORM session
  // with the value returned by `dbStateSelector` and passes
  // that Session instance as an argument instead.
  [ormSelector, getSyncQueue],
  (session, queue) => {
    /*
        return session.Patient.all().toModelArray().map(patient => {
            // Returns a reference to the raw object in the store,
            // so it doesn't include any reverse or m2m fields.
            const obj = patient.ref;
            // Object.keys(obj) === ['id', 'name']

            return Object.assign({}, obj, {
                comments: patient.comments.toRefArray().map(comment => comment.id),
            });
        });
        */

    //return session.Patient.all().toModelArray();

    // Add isInQueue status as property
    return session.Patient.all()
      .toModelArray()
      .map(patient => {
        const comments = patient.comments.toRefArray();
        const unsyncedComments = _.filter(comments, c => {
          return c.version !== c.extVersion;
        });
        const attachments = patient.attachments.toRefArray();
        const unsyncedAttachments = _.filter(attachments, a => {
          return a.version !== a.extVersion;
        });
        const answers = patient.answers.toRefArray();
        const unsyncedAnswers = _.filter(answers, a => {
          return a.version !== a.extVersion;
        });
        const obj = patient.ref;
        return Object.assign({}, obj, {
          comments,
          attachments: patient.attachments.toRefArray(),
          answers: patient.answers.toRefArray(),
          isInQueue: _.find(queue, _.matches({ id: patient.id, entity: 'Patient' })) ? true : _.find(queue, _.matches({ parentId: patient.id })),
          unsyncedObjects: { comments: unsyncedComments, attachments: unsyncedAttachments, answers: unsyncedAnswers },
          unsyncedObjectsTotal: unsyncedComments.length + unsyncedAttachments.length + unsyncedAnswers.length
        });
      });
  }
);

function getFilterDate(days) {
  const filterDate = new Date();
  filterDate.setDate(filterDate.getDate() - days);
  return filterDate;
}

export const getVisiblePatients = createSelector(
  [getPatients, getVisibilityFilter],
  (patients, visibilityFilter) => {
    switch (visibilityFilter) {
      case 'SHOW_30D':
        return patients.filter(p => {
          return new Date(p.admissionDate) >= getFilterDate(30);
        });
      case 'SHOW_6M':
        return patients.filter(p => {
          return new Date(p.admissionDate) >= getFilterDate(180);
        });
      case 'SHOW_1Y':
        return patients.filter(p => {
          return new Date(p.admissionDate) >= getFilterDate(365);
        });
      case 'SHOW_STAT':
        return patients.filter(p => {
          return !p.dischargeDate;
        });
      default:
        return patients;
    }
  }
);

export const getVisiblePatientsFilteredBySearchTerm = createSelector(
  [getVisiblePatients, getSearchTerm, getSearchFilter],
  (visiblePatients, searchTerm, searchFilter) => {
    if (!searchTerm) {
      return visiblePatients;
    }
    switch (searchFilter) {
      case 'SEARCH_ALL':
        // TODO: Needs to support nested props...
        return visiblePatients.filter(p => {
          return _.some(p, v => {
            return _.toLower(v).indexOf(_.toLower(searchTerm)) > -1;
          });
        });
      case 'SEARCH_ID':
        return visiblePatients.filter(p => {
          return p.identifier.indexOf(searchTerm) > -1;
        });
      case 'SEARCH_NOM':
        const names = ['firstName', 'lastName', 'middleName'];
        return _.filter(visiblePatients, p => {
          return (
            _(p)
              .pick(names)
              .values()
              .toLower()
              .indexOf(_.toLower(searchTerm)) > -1
          );
          // If we want to split the search terms...
          //.intersection(searchTerm.split(' '))
          //.size() > 0;
        });
      case 'SEARCH_DOB':
        return visiblePatients.filter(p => {
          return p.birthday && p.birthday.indexOf(searchTerm) > -1;
        });
      case 'SEARCH_DIAG':
        return visiblePatients.filter(p => {
          return p.diagnosis && p.diagnosis.indexOf(searchTerm) > -1;
        });
      case 'SEARCH_COM':
        return visiblePatients.filter(p => {
          return _.some(p.comments, c => {
            return _.toLower(c.text).indexOf(_.toLower(searchTerm)) > -1;
          });
        });
      default:
        return visiblePatients;
    }
  }
);

// TODO: Not yet implemented
export const getSortedAndVisiblePatients = createSelector(
  [getVisiblePatientsFilteredBySearchTerm, getSortSelection, getSortDirection],
  (visiblePatients, sortSelection, sortDirection) => {
    switch (sortSelection) {
      case 'NOM':
        return visiblePatients;
      case 'DOB':
        return visiblePatients;
      case 'ENTRY':
        return visiblePatients;
      case 'EXIT':
        return visiblePatients;
      case 'DIAG':
        return visiblePatients;
      default:
        return visiblePatients;
    }
  }
);
