import {
    ADD_TO_QUEUE,
    REMOVE_ATTACHMENT,
    REMOVE_COMMENT,
} from './types';


export const syncObject = (object, entity) => ({
    type: ADD_TO_QUEUE,
    payload: {
        entity, id: object.id, extId: object.extId || null, parentId: object.patient || null
    }
});

export const removeAttachment = (attachment) => ({
    type: REMOVE_ATTACHMENT,
    payload: attachment,
    meta: {sync: {entity: 'Attachment'}}
});

export const removeComment = (comment) => ({
    type: REMOVE_COMMENT,
    payload: comment,
    meta: {sync: {entity: 'Comment'}}
});
