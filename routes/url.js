const express = require('express');
const URL = require('../models/url');

const { handleGenerateNewShortURL, handleRedirectOnURLAndUpdateTimestamp, handleGetAnalytics } = require('../controllers/url');
const router = express.Router();


router.post("/", handleGenerateNewShortURL);

router.get('/:shortId',handleRedirectOnURLAndUpdateTimestamp);

router.get('/analytics/:shortId',handleGetAnalytics)



module.exports = router;
