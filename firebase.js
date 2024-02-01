const admin = require("firebase-admin");
const serviceAccount = require("./splitwise-clone-72044-firebase-adminsdk-h17k3-f9da892a41.json");

admin.initializeApp({
  credential : admin.credential.cert(serviceAccount),
  databaseURL : "https://splitwise-clone-72044.firebaseio.com",
});

module.exports = admin;
