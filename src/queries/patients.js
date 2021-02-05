import gql from 'graphql-tag';

export const UPSERT_PATIENTS = gql`
  mutation upsertPatient($insertObjects: [patient_insert_input!]!, $updateColumns: [patient_update_column!]!) {
    response: insert_patient(objects: $insertObjects, on_conflict: { constraint: patient_pkey, update_columns: $updateColumns }) {
      affected_rows
      returning {
        uuid
        version
      }
    }
  }
`;

export const DELETE_PATIENT = gql`
  mutation deletePatient($uuid: uuid!, $timestamp: timestamptz!) {
    deletePatient: update_patient(where: { uuid: { _eq: $uuid } }, _set: { deleted: true, timestamp_deleted: $timestamp }) {
      affected_rows
    }
  }
`;
