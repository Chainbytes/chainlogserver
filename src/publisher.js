import zmq from 'zeromq';
import {logger} from './helper/logging.js'
import dataBase from "nedb";
//import {encrypt, decrypt} from './helper/encryption.js'  TODO:  Add Encryption
const db = new dataBase(({filename: process.env.DB_LOCATION || 'chainlogging.db', autoload: true}));
const responder = zmq.socket('rep');
logger.debug("Starting up");
const bindingAddress = process.env.BINDING || 'tcp://*:60400';
console.log('Binding to port: ' + bindingAddress);

responder.bind(bindingAddress, err => {
    if (err) {
        console.log("error binding" + err);
        logger.error(err);
        throw err;
    }
    logger.info('Listening for requestors')
})
responder.on('message', data => {
    try {
        const jsonData = JSON.parse(data);
        jsonData.timestamp = Date.now();
        db.insert(jsonData, (err, docs) => {
            if (err === null) {
                responder.send(JSON.stringify({success: true}))
            }
            else {
                responder.send(err)
            }
        })
    } catch (e) {
        logger.error(e);
        console.log(e)
        responder.send(JSON.stringify({error: e}))
        logger.error(e);
    }
})
process.on('SIGINT', () => {
    responder.close();
});
