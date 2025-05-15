const admin = require("firebase-admin");

var serviceAccount = require('../nodejsexpress.304203.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nodejsexpress-d1e5c-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
module.exports = db;