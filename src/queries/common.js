import gql from 'graphql-tag';

export const GET_ENUMS = gql`
    query getEnum($type: String!) {
        type: __type(name: $type) {
            enumValues {
                name
            }
        }
    }
`;
