import { HandlerInput, RequestHandler, SkillBuilders, getSlotValue, getRequestType, getIntentName } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model'
import firebaseadmin from 'firebase-admin';

import db, { doc_converter, stateInRoomTable } from './db_functions.js';

/*
 * Function for Alexa IntentRequest
 */
const AlexaEnterLeaveIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && getIntentName(handlerInput.requestEnvelope) === 'AlexaEnterLeaveIntent';
    },
    async handle(handlerInput: HandlerInput): Promise<Response> {
        console.log("AlexaEnterLeaveIntentHandler was called...");

        const inputRoomName: string = getSlotValue(handlerInput.requestEnvelope, 'room');
        const inputActionName = getSlotValue(handlerInput.requestEnvelope, 'action');
        console.log("room: " + inputRoomName + " action: " + inputActionName);

        // update room status.
        const inRoomRef = db.collection('state/inroom/rooms').doc(inputRoomName).withConverter(doc_converter<stateInRoomTable>());

        let roomState: boolean = false;
        if (inputActionName == '入室') {
            roomState = true;
        }

        let setInroomState: stateInRoomTable = {
            inState: roomState,
        };

        try {
            await inRoomRef.update(setInroomState);
            console.log('updating ' + inputRoomName + ' to ' + inputActionName + ' was succeed.');

            // save logs
            const logsRef = db.collection('log').doc('Inroom').collection('Logs');
            try {
                await logsRef.add({
                    name: inputRoomName,
                    action: inputActionName,
                    date: firebaseadmin.firestore.FieldValue.serverTimestamp()
                });
            }
            catch (error) {
                console.log('adding log for ' + inputRoomName + ' to ' + inputActionName + ' was failed.: %s', error);
            }


        }
        catch (error) {
            console.log('updating ' + inputRoomName + ' to ' + inputActionName + ' was failed.: %s', error);
        }

        return handlerInput.responseBuilder
            .getResponse();
    }
};

// set alexa handlers
const skillBuilder = SkillBuilders // get SkillBuilder
    .custom() // get CustomSkillBuilder
    .withSkillId(process.env.ALEXA_ENTERLEAVE_SKILL_ID || '') // whether my skill or not
    .addRequestHandlers(AlexaEnterLeaveIntentHandler)
    .lambda();

export default skillBuilder;
