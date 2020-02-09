// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyDh3F0PLVz_9p9d-5gtp9AFPjyQZ72ut2w",
    authDomain: "customer-id-backend.firebaseapp.com",
    databaseURL: "https://customer-id-backend.firebaseio.com",
    projectId: "customer-id-backend",
    storageBucket: "customer-id-backend.appspot.com",
    messagingSenderId: "1001460127331",
    appId: "1:1001460127331:web:4892687b11c5dd23cc8a56"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const customersRef = db.collection("customers");

const express = require('express');
var cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors())

// app.get('/', (req, res) => res.send('Hello World!'));
app.get('/', (req, res) => {
    let data = [];
    const allCustomers = customersRef.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const customerData = doc.data();
                const customerID = doc.id;

                const customer = customerData;
                customer.id = customerID
                data.push(customer);

                console.log(doc.id, '=>', doc.data());
            });
            res.json(data);
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

app.get('/getCustomer', (req, res) => {
    let customerRef = customersRef.doc(req.query.id);
    let getCustomer = customerRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                console.log('Document data:', doc.data());
                const customerData = doc.data();
                const customerID = doc.id;

                const customer = customerData;
                customer.id = customerID
                data.push(customer);

                res.json(data);
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
});

app.listen(port, () => console.log(`~~Listening on port ${port}~~`))