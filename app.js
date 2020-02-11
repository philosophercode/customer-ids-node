const firebase = require("firebase/app");
require("firebase/firestore");

const firebaseConfig = {
    // apiKey: "AIzaSyDh3F0PLVz_9p9d-5gtp9AFPjyQZ72ut2w",
    // authDomain: "customer-id-backend.firebaseapp.com",
    // databaseURL: "https://customer-id-backend.firebaseio.com",
    projectId: "customer-id-backend",
    // storageBucket: "customer-id-backend.appspot.com",
    // messagingSenderId: "1001460127331",
    // appId: "1:1001460127331:web:4892687b11c5dd23cc8a56"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const customersRef = db.collection("customers");

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors())

app.get('/', (req, res) => {
    console.log('firebase.config', firebaseConfig)
    customersRef.get()
        .then(snapshot => {
            const data = [];
            snapshot.forEach(doc => {
                const customer = doc.data();
                customer.id = doc.id;
                delete customer.role
                delete customer.age
                data.push(customer);
            });
            return data.length === 0 ? res.status(404) : res.json(data);
        })
        .catch(err => {
            // Error fetching documents
            return res.status(404).json(err);
        });
});

app.get('/getCustomer', (req, res) => {
    let customerRef = customersRef.doc(req.query.id);
    customerRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
                return res.status(404);
            } else {
                let data = [];
                console.log('Document data:', doc.data());
                const customerData = doc.data();
                const customerID = doc.id;

                const customer = customerData;
                customer.id = customerID
                data.push(customer);

                return res.json(data);
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
});

app.listen(port, () => console.log(`~~Listening on port ${port}~~`));