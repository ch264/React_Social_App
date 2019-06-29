const functions = require('firebase-functions');

// import admin SDK for access to database
const admin = require('firebase-admin');
admin.initializeApp();

// import express
const express = require('express');
const app = express();

// get documents(data) from firebase
app.get('/shouts', (req, res) => { // first argument is name of route and the second is the handler
	admin
	.firestore()
	.collection('shouts')
	.get()
	.then((data) => {
		let shouts = [];
		data.forEach((doc) => {
			shouts.push(doc.data()); // data() is function that returns data inside the document
		});
		return res.json(shouts); // return as json
	})
	.catch(err => console.error(err))
});


// creates firebase document
exports.createShout = functions.https.onRequest((req, res) => {
	if(req.method !== 'POST'){
		return res.status(400).json({error: 'Method not allowed, client error'})
	}
	const newShout = {
		body: req.body.body,
		userHandle: req.body.userHandle,
		createdAt: admin.firestore.Timestamp.fromDate(new Date())
	};
	// add takes json object and adds it to the the database
	admin.firestore().collection('shouts').add(newShout).then(doc => {
		res.json({ message: `document ${doc.id} created successfully`})
		.catch(err => {
			res.status(500).json({error: `something went wrong`});
			console.error(err);
		})
	})
})

// best practices for API: https://baseurl.com/api/....

// tell app that app is the container for all routes in it
exports.api = functions.https.onRequest(app)