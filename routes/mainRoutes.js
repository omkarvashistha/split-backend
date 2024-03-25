const express = require('express');
const router = express.Router();
const mainController = require('../Controller/mainController');
const cors = require('cors');
const helper  = require('../utilities/helper');

router.use(cors())

router.all('/',() => {
    console.log("I am here");
})

/************User API Routes************/
router.post('/login',mainController.login);     
router.post('/signup',mainController.createUser);
router.post('/getNameFromId',mainController.getNameFromId);
router.post('/getFriends',mainController.getFriends);
router.post('/addFriend',mainController.addFriend);

/************Group API Routes************/
router.get("/:email/getGroups",mainController.getGroups);
router.post('/addGroup',mainController.addGroup);


/*Transaction APIs */
router.post("/addTransaction",mainController.addTransaction);
router.post("/getTransactionForGroup",mainController.getTransactionForGroup);

router.all('*',mainController.invalid);
module.exports = router