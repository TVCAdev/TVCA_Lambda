import Alexa from 'ask-sdk';
import firebaseadmin from'firebase-admin';

import db from './db_functions.mjs';

/*
 * Function for Alexa IntentRequest
 */
const AlexaEnterLeaveIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AlexaEnterLeaveIntent';
    },
    handle(handlerInput) {
        console.log("AlexaEnterLeaveIntentHandler was called...");

        const roomName = Alexa.getSlotValue(handlerInput.requestEnvelope, 'room');
        const actionName = Alexa.getSlotValue(handlerInput.requestEnvelope, 'action');
        console.log("room: " + roomName + " action: " + actionName);

        // update room status.
        const inRoomRef = db.collection('state').doc('inroom');

        let set_obj = {};
        if (actionName == '入室') {
            set_obj[roomName] = true;
        } else {
            set_obj[roomName] = false;
        }
        inRoomRef.update(set_obj)
            .then(doc => {
                console.log('updating ' + roomName + ' to ' + actionName + ' was succeed.');
            })
            .catch((error) => {
                console.log('updating ' + roomName + ' to ' + actionName + ' was failed.: %s', error);
            });

        // save logs
        const LogsRef = db.collection('log').doc('Inroom').collection('Logs');

        LogsRef.add({
            name: roomName,
            action: actionName,
            date: firebaseadmin.firestore.FieldValue.serverTimestamp()
        })
            .catch((error) => {
                console.log('adding log was error.:', error);
            });

        return handlerInput.responseBuilder
            .getResponse();
    }
};

// set alexa handlers
const skillBuilder = Alexa.SkillBuilders // get SkillBuilder
    .custom() // get CustomSkillBuilder
    .withSkillId(process.env.ALEXA_ENTERLEAVE_SKILL_ID) // whether my skill or not
    .addRequestHandlers(
        AlexaEnterLeaveIntentHandler
    )
    .lambda();

export default skillBuilder;
