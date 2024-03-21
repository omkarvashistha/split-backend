const admin = require('../firebase');
const firestore  = admin.firestore();

const Users = firestore.collection('users');
const Groups = firestore.collection('groups');
const Transactions = firestore.collection('transactions');
const userGroupMapping = firestore.collection('user-group-mapping');

module.exports = {Groups,Users,Transactions,userGroupMapping,firestore};
