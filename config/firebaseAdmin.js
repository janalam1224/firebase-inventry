const admin = require("firebase-admin");

var serviceAccount = require('../config/nodejsexpress-d1e5c-firebase-adminsdk-fbsvc-ee431a6166.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nodejsexpress-d1e5c-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
module.exports = db;