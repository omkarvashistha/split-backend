const express = require('express');
const router = express.Router();
const mainController = require('../Controller/mainController');
const cors = require('cors');

router.use(cors())

/************User API Routes************/
router.post('/signup',mainController.createUser);

/************Group API Routes************/

router.post('/addGroup',mainController.addGroup);
router.all('*',mainController.invalid);
module.exports = router