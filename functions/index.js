const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const admin = require('firebase-admin');
admin.initializeApp();//Create the default firebase app
const db = admin.firestore();

const CRUD = express(); //This will implement CRUD operations using the express framework
CRUD.use(cors({ origin: true })); //Web requests wont return cors errors

//constants relating to firestore structure
collection = '<some-collection>';

//default endpoint
CRUD.get('/', (req, res) => {
    return res.status(200).send(`FIRESTORE REST API EXAMPLE`);
});

//api endpoints:

/*
 * CRUD: READ
 * Example Get Request:
 * This request returns all of the data in the specified default collection
 */
CRUD.get('/', async (req, res) => {
    try {
        let query = db.collection(collection) //reference to target collection
        const snapshot = await query.get(); //ready snapshot for get request
        let responseData = []; //generate empty response data (JSON format)
        snapshot.forEach((doc) => {
            const data = {id: doc.id, data: doc.data()};
            responseData.push(data);
        });
        return res.status(200).send(responseData); //send response data to client
    } catch (error) { //catch potential error
        console.log(error); //log error in console
        return res.status(500).send(error); //display error message
    }
});

/*
 * CRUD: CREATE
 */
CRUD.post('/', async (req, res) => {
    try {
        const newData = req.body;
        await db.collection(collection).doc(uuidv4()).create(newData);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

/*
 * CRUD: DELETE
 * Delete by document id
 */
CRUD.delete('/:id', async (req, res) => {
    try {
        await db.collection(collection).doc(req.params.id).delete();
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

/*
 * CRUD: UPDATE (put)
 */
CRUD.put('/:id', async (req, res) => {
    try {
        await db.collection(collection).doc(req.params.id).set(req.body);
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

/*
 * CRUD: UPDATE (patch)
 */
CRUD.patch('/:id', async (req, res) => {
    try {
        await db.collection(collection).doc(req.params.id).update(req.body);
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

exports.api = functions.https.onRequest(CRUD);