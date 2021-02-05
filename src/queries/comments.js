import gql from 'graphql-tag';

export const UPSERT_COMMENTS = gql`
  mutation upsertComment($insertObjects: [comment_insert_input!]!, $updateColumns: [comment_update_column!]!) {
    response: insert_comment(objects: $insertObjects, on_conflict: { constraint: comment_pkey, update_columns: $updateColumns }) {
      affected_rows
      returning {
        uuid
        version
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($uuid: uuid!, $timestamp: timestamptz!) {
    deleteComment: update_comment(where: { uuid: { _eq: $uuid } }, _set: { deleted: true, timestamp_deleted: $timestamp }) {
      affected_rows
    }
  }
`;
