import gql from 'graphql-tag';

export const TRIGGER_PASSWORD_RESET = gql`
    mutation triggerPasswordReset($email: String!) {
        triggerPasswordReset(email: $email) {
            success
        }
    }
`;
