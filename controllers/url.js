const shortid = require("shortid");
const URL = require('../models/url');


async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({ error: 'url is required'});

    const shortID = shortid();

    await URL.create(
        {
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
            createdBy: req.user._id,
        }
    );

    return res.render('home',{
        id: shortID,
    });
}


async function handleRedirectOnURLAndUpdateTimestamp(req, res) {
    try {
        // console.log("Request Params:", req.params.shortId);
        const shortId = req.params.shortId;

        const entry = await URL.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } },
            { new: true }
        );

        // console.log("Entry:", entry);

        if (!entry) {
            return res.status(404).json({ error: "URL not found" });
        }

        // // Ensure redirectURL has a proper protocol (http/https)
        let redirectURL = entry.redirectURL;
        if (!redirectURL.startsWith("http://") && !redirectURL.startsWith("https://")) {
            redirectURL = "https://" + redirectURL; // Default to HTTPS
        }

        // console.log("Redirecting to:", redirectURL);
        return res.redirect(redirectURL);

    } catch (error) {
        console.error("Error handling redirect:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}



async function handleGetAnalytics(req, res) {

    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    return res.json({ totalClicks : result.visitHistory.length , 
        analytics: result.visitHistory,
    });
};


module.exports = {
    handleGenerateNewShortURL,
    handleRedirectOnURLAndUpdateTimestamp,
    handleGetAnalytics,
}