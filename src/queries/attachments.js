import gql from 'graphql-tag';

export const GET_PRESIGNED_URL = gql`
  mutation preSignRequest($input: PreSignInput!) {
    preSignRequest(input: $input) {
      targetUrl
      signedUrl
      uuid
    }
  }
`;

export const UPSERT_ATTACHMENTS = gql`
  mutation upsertAttachment($insertObjects: [attachment_insert_input!]!, $updateColumns: [attachment_update_column!]!) {
    response: insert_attachment(objects: $insertObjects, on_conflict: { constraint: attachment_pkey, update_columns: $updateColumns }) {
      affected_rows
      returning {
        uuid
        version
      }
    }
  }
`;

export const DELETE_ATTACHMENT = gql`
  mutation deleteAttachment($uuid: uuid!, $timestamp: timestamptz!) {
    deleteAttachment: update_attachment(where: { uuid: { _eq: $uuid } }, _set: { deleted: true, timestamp_deleted: $timestamp }) {
      affected_rows
    }
  }
`;
