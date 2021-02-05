import { fk, many, attr, Model } from 'redux-orm';

export class Patient extends Model {
  toString() {
    return `Patient: ${this.name}`;
  }
  // Declare any static or instance methods you need.
  static upsert(props) {
    const idAttr = this.idAttribute;
    // EDIT:
    if (props.hasOwnProperty(idAttr) && this.hasId(props[idAttr])) {
      // Get actual patient by ID
      const model = this.withId(props[idAttr]);
      // Get patient with this identifier
      const patient = this.all()
        .filter(patient => {
          return patient.identifier === props.identifier;
        })
        .first();
      // Compare if the same identifier. If not, then throw error since duplicatee!
      if (patient && model[idAttr] !== patient[idAttr]) {
        const e = new Error(`Patient record with identifier ${props.identifier} already exists`);
        e.originalPatient = this.all()
          .filter(patient => {
            return patient.identifier === props.identifier;
          })
          .first();
        throw e;
      }
      props.version = model.version + 1;
      model.update(props);
      return model;
    }
    // CREATE: Check if already exists
    if (
      this.all()
        .filter(patient => {
          return patient.identifier === props.identifier;
        })
        .exists()
    ) {
      const e = new Error(`Patient record with identifier ${props.identifier} already exists`);
      e.originalPatient = this.all()
        .filter(patient => {
          return patient.identifier === props.identifier;
        })
        .first();
      throw e;
    }
    props.version = 1;
    return this.create(props);
  }

  //
  deleteCascade() {
    this.comments.toModelArray().forEach(commentModel => {
      return commentModel.deleteCascade();
    });
    this.attachments.toModelArray().forEach(attachmentModel => {
      return attachmentModel.deleteCascade();
    });
    this.answers.toModelArray().forEach(attachmentModel => {
      return attachmentModel.deleteCascade();
    });
    this.delete();
  }
}
Patient.modelName = 'Patient';
// Declare your related fields.
Patient.fields = {
  id: attr(),
  extId: attr(),
  version: attr(),
  extVersion: attr(),
  reviewed: attr(),
  identifier: attr(),
  firstName: attr(),
  lastName: attr(),
  middleName: attr(),
  gender: attr(),
  telephone: attr(),
  birthday: attr(),
  admissionDate: attr(),
  dischargeDate: attr(),
  diagnosis: attr()

  //comments: many('Comment', 'patients'),
  //attachments: many('Attachment', 'patients'),
  //questionnaires: many('Questionnaire', 'patients'),

  //name: attr(),
  //authors: many('Author', 'books'),
  //publisher: fk('Publisher', 'books'),
};

//////////////////////////U///

export class Comment extends Model {
  toString() {
    return `Comment: ${this.name}`;
  }

  // Declare any static or instance methods you need.
  static upsert(props) {
    const idAttr = this.idAttribute;
    if (props.hasOwnProperty(idAttr) && this.hasId(props[idAttr])) {
      const model = this.withId(props[idAttr]);
      props.version = model.version + 1;
      model.update(props);
      return model;
    }
    props.version = 1;
    return this.create(props);
  }

  //
  deleteCascade() {
    this.delete();
  }
}
Comment.modelName = 'Comment';
Comment.fields = {
  id: attr(),
  extId: attr(),
  version: attr(),
  extVersion: attr(),
  patient: fk('Patient', 'comments'),
  text: attr(),
  date: attr()
};

export class Attachment extends Model {
  toString() {
    return `Attachment: ${this.name}`;
  }

  // Declare any static or instance methods you need.
  static upsert(props) {
    const idAttr = this.idAttribute;
    if (props.hasOwnProperty(idAttr) && this.hasId(props[idAttr])) {
      const model = this.withId(props[idAttr]);
      props.version = model.version + 1;
      model.update(props);
      return model;
    }
    props.version = 1;
    return this.create(props);
  }

  deleteCascade() {
    this.delete();
  }
}
Attachment.modelName = 'Attachment';
Attachment.fields = {
  id: attr(),
  extId: attr(),
  version: attr(),
  extVersion: attr(),
  patient: fk('Patient', 'attachments'),
  name: attr(),
  uri: attr(),
  description: attr()
};

export class Answer extends Model {
  toString() {
    return `Answer: ${this.name}`;
  }

  static upsert(props) {
    const idAttr = this.idAttribute;
    if (props !== undefined && props.hasOwnProperty(idAttr) && this.hasId(props[idAttr])) {
      const model = this.withId(props[idAttr]);
      props.version = model.version + 1;
      model.update(props);
      return model;
    }
    props.version = 1;
    return this.create(props);
  }

  deleteCascade() {
    this.delete();
  }
}
Answer.modelName = 'Answer';
Answer.fields = {
  id: attr(),
  extId: attr(),
  version: attr(),
  extVersion: attr(),
  date: attr(),
  type: attr(),
  patient: fk('Patient', 'answers')
};

export class Questionnaire extends Model {
  toString() {
    return `Questionnaire: ${this.name}`;
  }
}
Questionnaire.modelName = 'Questionnaire';
Questionnaire.fields = {
  extId: attr(),
  version: attr(),
  type: attr(),
  schema: attr()
};
Questionnaire.options = {
  idAttribute: 'extId'
};
