import {orm, emptyDBState} from '../models';

import {
    ADD_ANSWER,
    REMOVE_ANSWER,
    UPDATE_ANSWER,
    UPSERT_ENTITY,
    DELETE_ENTITY,
    UPDATE_VERSION,
    DELETE_PATIENT,
    ADD_COMMENT,
    REMOVE_COMMENT,
    ADD_ATTACHMENT,
    REMOVE_ATTACHMENT,
} from '../actions/types';

export default (dbState = emptyDBState, action) => {
    const session = orm.session(dbState);
    const { Patient, Comment, Attachment, Answer } = session;
    const { payload, meta } = action;

    switch (action.type) {
        case ADD_ANSWER: {
            const answer = Object.assign({}, payload.answer);
            Answer.create(answer);
            return session.state;
        }
        case REMOVE_ANSWER: {
            Answer.withId(payload.id).deleteCascade();
            return session.state;
        }
        case UPDATE_ANSWER: {
            Answer.withId(payload.id).update(payload);
            return session.state;
        }
        case UPSERT_ENTITY: {
            session[meta.entity].upsert(payload);
            return session.state;
        }
        case DELETE_ENTITY: {
            session[meta.entity].withId(payload).delete();
            return session.state;
        }
        case UPDATE_VERSION: {
            session[meta.entity].update(payload);
            return session.state;
        }
        case DELETE_PATIENT: {
            Patient.withId(payload.id).deleteCascade();
            return session.state;
        }
        case ADD_COMMENT: {
            //TODO: With m2m, this worked...
            //Patient.withId(payload.patientId).comments.add(payload.comment);
            const comment = Object.assign({}, {patient: payload.patientId}, payload.comment);
            Comment.create(comment);
            return session.state;
        }
        case REMOVE_COMMENT: {
            Comment.withId(payload.id).deleteCascade();
            return session.state;
        }
        case ADD_ATTACHMENT: {
            const attachment = Object.assign({}, {patient: payload.patientId}, payload.attachment);
            Attachment.create(attachment);
            return session.state;
        }
        case REMOVE_ATTACHMENT: {
            Attachment.withId(payload.id).deleteCascade();
            return session.state;
        }
        default: {
            return dbState;
        }
    }
};
