import gql from 'graphql-tag';

export const UPSERT_ANSWERS = gql`
    mutation upsertAnswer($insertObjects: [answer_insert_input!]!, $updateColumns: [answer_update_column!]!) {
        response: insert_answer(objects: $insertObjects, on_conflict: { constraint: answer_pkey, update_columns: $updateColumns }) {
            affected_rows
            returning {
                uuid
                version
            }
        }
    }
`;

export const DELETE_ANSWER = gql`
    mutation deleteAnswer($uuid: uuid!, $timestamp: timestamptz!) {
        deleteAnswer: update_answer(where: { uuid: { _eq: $uuid } }, _set: { deleted: true, timestamp_deleted: $timestamp }) {
            affected_rows
        }
    }
`;

export const REALLY_DELETE_ANSWER = gql`
    mutation deleteAnswer($uuid: uuid!) {
        delete_answer(where: { uuid: { _eq: $uuid } }) {
            affected_rows
        }
    }
`;
