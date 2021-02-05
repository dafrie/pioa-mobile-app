import _ from "lodash";
import { NetInfo } from "react-native";
import axios from "axios";
import humps from "humps";

import { uuidv4 } from "./uuid";
import { store } from "../store";
import { orm, emptyDBState } from "../models";
import {
  ADD_TO_QUEUE,
  REMOVE_FROM_QUEUE,
  UPSERT_ENTITY,
  UPDATE_VERSION,
  START_UPLOADING,
  UPDATE_PROGRESS,
  FINISH_UPLOADING,
  UPDATE_QUESTIONNAIRES,
  DELETE_ENTITY,
  DISPLAY_WARNING,
  REFRESH_TOKEN
} from "../actions/types";
import timeout from "./timeout";
import client from "../client";

import {
  GET_CURRENT_QUESTIONNAIRE_IDS,
  GET_QUESTIONNAIRES_BY_IDS
} from "../queries/questionnaires";
import { UPSERT_PATIENTS, DELETE_PATIENT } from "../queries/patients";
import { UPSERT_COMMENTS, DELETE_COMMENT } from "../queries/comments";
import { UPSERT_ATTACHMENTS, DELETE_ATTACHMENT, GET_PRESIGNED_URL } from "../queries/attachments";
import { UPSERT_ANSWERS, DELETE_ANSWER } from "../queries/answers";
import { GET_ENUMS } from "../queries/common";

const resources = {
  Patient: "patient",
  Comment: "comment",
  Attachment: "attachment",
  Answer: "answer"
};

const deleteMutations = {
  patient: DELETE_PATIENT,
  comment: DELETE_COMMENT,
  attachment: DELETE_ATTACHMENT,
  answer: DELETE_ANSWER
};

/**
 * Get all remote uuids and versions of active questionnaires. Compare them with the ones on the device.
 * Then remove all quetsionnaires on the device that are not anymore on the server.
 * And finally get the payload of the questionnaires that are not on the device and create them.
 */
async function syncQuestionnaires() {
    console.log("Syncing questionnaires...")
    // Initialize
    const currentStore = store.getState();
    const session = orm.session(currentStore.orm);

    // Get all available, remote questionnaires
    const result = await client.query({ query: GET_CURRENT_QUESTIONNAIRE_IDS, fetchPolicy: "no-cache"  });
    const { questionnaires } = result.data;
    const remoteQuestionnaires = questionnaires.map(q => {
      return { uuid: q.uuid, version: q.version };
    });

    // Get all local questionnaires
    let localQuestionnaires = session.Questionnaire.all().toRefArray();
    localQuestionnaires = _.map(localQuestionnaires, questionnaire => {
      return { uuid: questionnaire.extId, version: questionnaire.version };
    });
  
    // Get intersection
    const onlyOnRemote = [];
    remoteQuestionnaires.forEach(r => {
      if (!_.some(localQuestionnaires, r)) {
        onlyOnRemote.push(r);
      }
    });
    const onlyOnLocal = [];
    localQuestionnaires.forEach(l => {
      if (!_.some(remoteQuestionnaires, l)) {
        onlyOnLocal.push(l);
      }
    });

    // Of the new questionnaires, get the full payload
    const uuids = onlyOnRemote.map(u => u.uuid);
    const newResult = await client.query({
      query: GET_QUESTIONNAIRES_BY_IDS,
      variables: { uuids },
      fetchPolicy: "no-cache"
    });
    const newQuestionnaires = newResult.data.questionnaire;

    // Upsert new questionnaires into the Redux Store
    _.map(newQuestionnaires, q =>
      store.dispatch({
        type: UPSERT_ENTITY,
        payload: {
          extId: q.uuid,
          version: q.version,
          schema: q.schema,
          type: q.type.type
        },
        meta: { entity: "Questionnaire" }
      })
    );

    // Remove all stale questionnaires on the device
    _.map(onlyOnLocal, q => {
      return store.dispatch({
        type: DELETE_ENTITY,
        payload: q.uuid,
        meta: { entity: "Questionnaire" }
      })
    });

    // Alert user that forms have been updated
    if (newQuestionnaires.length) {
      console.log("HAVE NEW QUESTIONNAIRES")
      const length = newQuestionnaires.length;
      store.dispatch({
        type: DISPLAY_WARNING, payload: `${length} form(s) have been updated in the backend!`
      })
      await timeout(4000);
      store.dispatch({ type: DISPLAY_WARNING, payload: "" });
    }

    return result;
  }

function addPatientRelationship(session, entity, object) {
  const res = { ...object };
  if (entity !== "Patient") {
    const patient = session[entity].withId(res.id).patient.ref;
    if (patient.extId) {
      res.patient = patient;
      return res;
    } else {
      // Return null if no patient extid is set
      return null;
    }
  }
  return res;
}

function _urlToBlob(url) {
  return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.responseType = 'blob'; // convert type
      xhr.open('GET', url, true);
      xhr.send();
  })
}

async function getSignedRequestAndUpload(file) {
    const fileType = "image/jpeg";
    try {
      const response = await client.mutate({
        mutation: GET_PRESIGNED_URL,
        variables: {
          input: {
            resourceType: "attachments",
              fileType
          }
        },
        fetchPolicy: "no-cache"
      });
      const { uuid, signedUrl, targetUrl } = response.data.preSignRequest; 

      // Now get from local (!) filesystem
      const blob = await _urlToBlob(file.uri);
      // Note: S3 is a bit picky. It absolutely requires the Content-Length. 
      // Content-Type aswell, otherwise the connection will be reset or actually wrong headers will be sent and the sign verification fails...
      const config = { 
        headers: { 'Content-Length': blob.size, 'Content-Type': fileType },
        // TODO: Fetch unfortunately doesn't support a callback and Axios does not work with blob's currently. So no progress....
        onUploadProgress: progressEvent => {
          const { loaded, total } = progressEvent;
          store.dispatch({
            type: UPDATE_PROGRESS,
            payload: { loaded, total }
          });
        }
      };
      // See here: https://github.com/facebook/react-native/issues/22681. Axios does not seem to work with Blob. Worked however once before...
      // // const res = await axios.put(signedUrl, blob, config);
      const res = await fetch(signedUrl, { method: 'PUT', headers: config.headers, body: blob })
      // blob.close(); // TODO: Should close blob? Or not? Method is not available however...
      store.dispatch({
        type: FINISH_UPLOADING
      });
      return { uuid, targetUrl };
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
}

async function getParameters(type, payload) {
  // General stuff
  const decamelizedPayload = humps.decamelizeKeys(payload);
  delete decamelizedPayload.id;
  decamelizedPayload.uuid = decamelizedPayload.ext_id || uuidv4();
  delete decamelizedPayload.ext_id;
  delete decamelizedPayload.ext_version;
  const enums = await client.query({
    query: GET_ENUMS,
    variables: { type: `${type}_update_column` },
    fetchPolicy: "no-cache"
  });
  const columns = enums.data.type.enumValues.map(i => i.name);
  if (type !== "patient") {
    // Only add if ext_id is set...
    if (decamelizedPayload.patient.ext_id) {
      decamelizedPayload.patient_uuid = decamelizedPayload.patient.ext_id;
    }
    delete decamelizedPayload.patient;
  }
  function isPatient() {
    return {
      query: UPSERT_PATIENTS,
      variables: { insertObjects: [decamelizedPayload], updateColumns: columns }
    };
  }
  function isComment() {
    decamelizedPayload.timestamp = new Date(decamelizedPayload.date);
    delete decamelizedPayload.date;
    return {
      query: UPSERT_COMMENTS,
      variables: { insertObjects: [decamelizedPayload], updateColumns: columns }
    };
  }
  function isAttachment() {
    delete decamelizedPayload.uri;
    return {
      query: UPSERT_ATTACHMENTS,
      variables: { insertObjects: [decamelizedPayload], updateColumns: columns }
    };
  }
  function isAnswer() {
    delete decamelizedPayload.page_known;
    delete decamelizedPayload.page_number;
    delete decamelizedPayload.questionnaire_id;
    delete decamelizedPayload.date;
    delete decamelizedPayload.update_timestamp;
    delete decamelizedPayload.first_time;
    delete decamelizedPayload.type;
    delete decamelizedPayload.questionnaire_ext_id;

    return {
      query: UPSERT_ANSWERS,
      variables: { insertObjects: [decamelizedPayload], updateColumns: columns }
    };
  }
  const types = {
    patient: isPatient,
    comment: isComment,
    attachment: isAttachment,
    answer: isAnswer
  };
  return types[type]();
}

/**
 * Creates a new Resource or updates if exists
 * @param {*} resourceType
 * @param {*} payload
 *
 * @returns resource
 */
async function upsertResource(resourceType, payload) {
  const parameters = await getParameters(resourceType, payload);
  const result = await client.mutate({
      mutation: parameters.query,
      variables: parameters.variables,
      fetchPolicy: "no-cache"
  });
  return result.data.response.returning;
} 

export async function syncData() {
  console.log("Starting the syncing job...");
  const connectionInfo = await NetInfo.getConnectionInfo();
  const connected = await NetInfo.isConnected.fetch();
  const { type } = connectionInfo;

  const state = store.getState();
  const { useCellular, syncAttachments, syncSwitch } = state.settings;

  // Abort if no connection or syncSwitch is off
  if (!connected || !syncSwitch) {
    return null;
  }

  // Abort if on cellular network and settings do not allow
  if (type === "cellular" && !useCellular) {
    return null;
  }

  

  if (state.auth.user) {
      const queue = state.syncQueue.queue;
      const session = orm.session(state.orm); // = emptyDBState);

      const maxRetries = 2;
      let trials = 1;
      let i = 0;
      // Outer loop: Required if we want to enable retry mechanism
      while (i++ < trials && trials <= maxRetries) {

        // Sync Queue
        try {

          // Inner loop
          for (let item of queue) {
            store.dispatch({
              type: START_UPLOADING
            });
            const { entity, id, extId, parentId } = item;
            const resourceType = resources[entity];
            // Special case for new attachments: Upload directly to S3
            if (entity === "Attachment") {
              if (extId === null && id !== undefined) {
                if (syncAttachments) {
                  const file = session["Attachment"].withId(id).ref;
                  const s3Obj = await getSignedRequestAndUpload(
                    file
                  );
                  const res = addPatientRelationship(session, entity, file);
                  res.extId = s3Obj.uuid;
                  res.s3Url = s3Obj.targetUrl;
                  
                  const result = await upsertResource(
                    resourceType,
                    res
                  );

                  store.dispatch({
                    type: UPDATE_VERSION,
                    payload: {
                      id,
                      extId: result[0].uuid,
                      extVersion: result[0].version
                    },
                    meta: { entity }
                  });
                  store.dispatch({
                    type: REMOVE_FROM_QUEUE,
                    payload: { entity, id, extId, parentId }
                  });
                }
                continue;
              }
            }

            // DELETE
            if (id === null) {
              const now = new Date().toISOString();
              await client.mutate({
                mutation: deleteMutations[resourceType],
                variables: { uuid: extId, timestamp: now },
                fetchPolicy: "no-cache"
              });
            } else {
              // Either CREATE or UPDATE
              const obj = session[entity].withId(id).ref;

              //  CREATE
              //  If not external ID, then must CREATE entity
              if (!obj.extId) {
                // Get patient relationship
                const payload = addPatientRelationship(session, entity, obj);
                // Only create entity if patient extid is set
                if (payload) {
                  const result = await upsertResource(
                    resourceType,
                    payload
                  );
                  store.dispatch({
                    type: UPDATE_VERSION,
                    payload: {
                      id,
                      extId: result[0].uuid,
                      extVersion: result[0].version
                    },
                    meta: { entity }
                  });
                } else {
                  // If no external id is set, continue with the loop.
                  console.log("Patient extid not found. First upload patient");
                  // TODO: Need to send that to notification bar...
                  trials++;
                  continue;
                }
              } else {
                // UPDATE
                const payload = addPatientRelationship(session, entity, obj);
                const result = await upsertResource(resourceType, payload);
                store.dispatch({
                  type: UPDATE_VERSION,
                  payload: {
                    id,
                    extId: result[0].uuid,
                    extVersion: result[0].version
                  },
                  meta: { entity }
                });
              }
            }
            store.dispatch({
              type: FINISH_UPLOADING
            });
            store.dispatch({
              type: REMOVE_FROM_QUEUE,
              payload: { entity, id, extId, parentId }
            });
          }
          // Get latest questionnaires
          await syncQuestionnaires();
          return true;
      } catch (err) {
        // TODO: Case when token has expired. Don't know why this is required, since we handle the errors in the client config????
        const { networkError } = err;
        if (networkError && networkError.result && networkError.result.errors && networkError.result.errors[0] && networkError.result.errors[0].message === 'Could not verify JWT: JWTExpired') {
          console.log("ID TOKEN has expired also here. Will call myself again shortly...")
          // Wait a few seconds
          await timeout(2000);
          // Call itself again...
          syncData();
          return false;
        }

        // Signal that upload is finished nevertheless of error
        store.dispatch({
          type: FINISH_UPLOADING
        });

        // Handle case when NOT ALLOWED
        if (err.response && err.response.status === 403) {
          store.dispatch({
            type: DISPLAY_WARNING,
            payload: err.response.data.error
          });
          await timeout(2000);
          store.dispatch({ type: DISPLAY_WARNING, payload: "" });
          return false;
        }

        // Handle general case
        console.log("GENERAL ERROR!")
        console.log(err);
        console.log(err.message);
        console.log(JSON.stringify(err))
      }
    }
  }
}


