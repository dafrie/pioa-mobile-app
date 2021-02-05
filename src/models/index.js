import { ORM } from 'redux-orm';
import { Patient, Comment, Attachment, Answer, Questionnaire } from './models';

export const orm = new ORM();
orm.register(Patient, Comment, Attachment, Answer, Questionnaire);

export const emptyDBState = orm.getEmptyState();
