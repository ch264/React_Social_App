const functions = require('firebase-functions');
// import admin SDK for access to database
const admin = require('firebase-admin');

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello World!");
});

// return data in firebase datastore
exports.getShouts = functions.https.onRequest((req, res) => {
	admin.firestore().collection('shouts').get()
	.then(data => {
		let shouts = [];
		data.forEach(doc => {
			shouts.push(doc.data()); // data() is function that returns data inside the document.
		}) 
	})
})