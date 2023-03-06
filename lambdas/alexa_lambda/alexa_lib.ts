import alexa, { ErrorHandler, HandlerInput, RequestHandler, SkillBuilders } from 'ask-sdk-core';
import { Response, SessionEndedRequest } from 'ask-sdk-model'
import firebaseadmin from 'firebase-admin';

import db, { doc_converter, stateInRoomTable } from './db_functions.js';

/*
 * Function for Alexa IntentRequest
 */
const AlexaEnterLeaveIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && alexa.getIntentName(handlerInput.requestEnvelope) === 'AlexaEnterLeaveIntent';
    },
    handle(handlerInput: HandlerInput): Response {
        console.log("AlexaEnterLeaveIntentHandler was called...");

        const inputRoomName: string = alexa.getSlotValue(handlerInput.requestEnvelope, 'room');
        const inputActionName = alexa.getSlotValue(handlerInput.requestEnvelope, 'action');
        console.log("room: " + inputRoomName + " action: " + inputActionName);

        // update room status.
        const inRoomRef = db.collection('state').doc('inroom').withConverter(doc_converter<stateInRoomTable[]>());

        let roomState: boolean = false;
        if (inputActionName == '入室') {
            roomState = true;
        }

        let setInroomState: stateInRoomTable = {
            roomName: inputRoomName,
            inState: roomState,
        }

        inRoomRef.withConverter(doc_converter<stateInRoomTable>()).update(setInroomState)
            .then(doc => {
                console.log('updating ' + inputRoomName + ' to ' + inputActionName + ' was succeed.');
                // save logs
                const LogsRef = db.collection('log').doc('Inroom').collection('Logs');

                LogsRef.add({
                    name: inputRoomName,
                    action: inputActionName,
                    date: firebaseadmin.firestore.FieldValue.serverTimestamp()
                })
                    .catch((error) => {
                        console.log('adding log was error.:', error);
                    });
            })
            .catch((error) => {
                console.log('updating ' + inputRoomName + ' to ' + inputActionName + ' was failed.: %s', error);
            });


        return handlerInput.responseBuilder
            .getResponse();
    }
};

// set alexa handlers
const skillBuilder = alexa.SkillBuilders // get SkillBuilder
    .custom() // get CustomSkillBuilder
    .withSkillId(process.env.ALEXA_ENTERLEAVE_SKILL_ID || '') // whether my skill or not
    .addRequestHandlers(AlexaEnterLeaveIntentHandler)
    .lambda();

export default skillBuilder;
