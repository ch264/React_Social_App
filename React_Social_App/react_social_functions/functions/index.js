const functions = require('firebase-functions');

// import express
const express = require('express');
const app = express();


// import admin SDK for access to database
const admin = require('firebase-admin');
// store the database in variable db
admin.initializeApp();

var firebaseConfig = {
	apiKey: "AIzaSyCNn89uzWO9UmdHVO-o6_mWtNptJ2vMmaw",
	authDomain: "socialapp-9fdae.firebaseapp.com",
	databaseURL: "https://socialapp-9fdae.firebaseio.com",
	projectId: "socialapp-9fdae",
	storageBucket: "socialapp-9fdae.appspot.com",
	messagingSenderId: "150912081800",
	appId: "1:150912081800:web:9df1c8b1db3a1762"
};


// import firebase and initialise
// const firebaseConfig = require('./config.js')
const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);
// admin.initializeApp();

const db = admin.firestore();
// admin.initializeApp();


// get documents(data) from firebase
app.get('/shouts', (req, res) => { // first argument is name of route and the second is the handler
	db
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
		createdAt: new Date().toISOString() // string instead of timestamppe
	};

	db
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

// create signup route
app.post('/signup', (req, res) => {

	const newUser = {
		email: req.body.email,
		password: req.body.password,
		confirmedPassword: req.body.confirmedPassword,
		handle: req.body.handle
	};

	// TODO: validate data
	let token;
	let userId; // declare token and userId so we can use it

	db.doc(`/users/${newUser.handle}`)
	.get()
	.then((doc) => { // firebase has a snaptshot of the document
		if (doc.exists){ // if doc already exists than that handle is already taken
			return res.status(400).json({ handle: `this handle is already taken` });
		} else {
			return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
		}
	})
	.then((data) => { // data gives us access to user
		userId = data.user.uid
		return data.user.getIdToken()
	})
	.then((token) => {
		token = token; // toekn is returned
		const userCredentials = {
			handle: newUser.handle,
			email: newUser.email,
			createdAt: new Date().toISOString(),
			userId: userId
		}
		return db.doc(`/users/&{newUser.handle}`).set(userCredentials) // set creates document
	})
	.then(() => {
		return res.status(201).json({ token });
	})
	.catch((err) => {
		console.error(err);
		if (err.code === 'auth/email-already-in-use'){
			return res.status(400).json({ email: 'Email is already in use' });
		} else {
		return res.status(500).json({ error: err.code })
		}
	});
// }); 

	firebase
	.auth()
	.createUserWithEmailAndPassword(newUser.email, newUser.password)
	.then((data) => {
		return res
		.status(201)
		.json({ message: `user: ${user.id} signed up successfully` });
	})
	.catch ((err) => {
			console.error(err);
			return res
			.status(500)
			.json({ json: err.code});
	})

}); 




// tell the app that app is the container for all routes in it
exports.api = functions.https.onRequest(app);




