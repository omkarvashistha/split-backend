const express = require('express');
const router = express.Router();
const mainController = require('../Controller/mainController');
const cors = require('cors');

router.use(cors())

router.all('/',() => {
    console.log("I am here");
})

/************User API Routes************/
router.post('/login',mainController.login);     
router.post('/signup',mainController.createUser);

/************Group API Routes************/
router.get("/:email/getGroups",mainController.getGroups);
router.post('/addGroup',mainController.addGroup);
router.all('*',mainController.invalid);
module.exports = router