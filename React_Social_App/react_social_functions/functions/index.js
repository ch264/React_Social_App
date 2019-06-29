const functions = require('firebase-functions');

// import admin SDK for access to database
const admin = require('firebase-admin');

const firebaseConfig = require('./config.js')


admin.initializeApp(firebaseConfig);


// import express
const express = require('express');
const app = express();

// get documents(data) from firebase
app.get('/shouts', (req, res) => { // first argument is name of route and the second is the handler
	admin
	.firestore()
	.collection('shouts')
	.orderBy('createdAt', 'desc')
	.get()
	.then((data) => {
		let shouts = [];
		data.forEach((doc) => {
			shouts.push({
				screamId: doc.id,
				body: doc.data().body,
				userHandle: doc.data().userHandle,
				createdAt: doc.data.createdAt
			}); // data() is function that returns data inside the document
		});
		return res.json(shouts); // return as json
	})
	.catch(err => console.error(err))
});


// creates firebase document
app.post('/shout', (req, res) => {
	
	const newShout = {
		body: req.body.body,
		userHandle: req.body.userHandle,
		createdAt: new Date().toISOString()
	};

	admin
	.firestore()
	.collection('shouts')
	.add(newShout) // add takes json object and adds it to the the database
	.then((doc) => {
		res.json({ message: `document ${doc.id} created successfully`});
	}).catch((err) => {
		res.status(500).json({ error: `something went wrong` });
		console.error(err);
	});
});


// best practices for API: https://baseurl.com/api/....

// tell the app that app is the container for all routes in it
exports.api = functions.https.onRequest(app);




