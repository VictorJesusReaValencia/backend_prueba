const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json'); // Ajusta el nombre según el tuyo

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://acervodb.firebasestorage.app', // Copia esto de firebaseConfig.storageBucket
});

const bucket = admin.storage().bucket();
module.exports = bucket;


