import gql from 'graphql-tag';

export const GET_CURRENT_QUESTIONNAIRE_IDS = gql`
  {
    questionnaires(where: { type_deleted: { _eq: false } }) {
      uuid
      version
    }
  }
`;

export const GET_QUESTIONNAIRES_BY_IDS = gql`
  query queryQuestionnairesById($uuids: [uuid]) {
    questionnaire(where: { uuid: { _in: $uuids } }) {
      uuid
      version
      schema
      description
      type {
        type
      }
    }
  }
`;
