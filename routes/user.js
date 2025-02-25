const express = require('express');

const { handelUserSignUp, handelUserLogin } = require("../controllers/user");

const router = express.Router();

router.post('/',handelUserSignUp);
router.post('/login',handelUserLogin);


module.exports = router;