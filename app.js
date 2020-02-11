const firebase = require("firebase/app");
require("firebase/firestore");

const firebaseConfig = {
    projectId: "customer-id-backend"
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
                console.log('Document data:', doc.data());
                const customer = doc.data();
                customer.id = doc.id;
                return res.json(customer);
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
});

app.listen(port, () => console.log(`~~Listening on port ${port}~~`));