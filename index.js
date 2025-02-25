const express = require("express");
const path = require("path");

const cookieParser = require('cookie-parser');

const { restrictTo, checkForAuthentication } = require('./middlewares/auth');

const cors = require("cors");
const {connectToMongoDB} = require('./connect');

const staticRoute = require('./routes/staticRouter');
const urlRoute = require('./routes/url');
const userRoute = require('./routes/user');


const URL = require("./models/url");


const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
.then(() => console.log('Mongodb connected'));




app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

app.use(cors()); // Enable CORS for all requests
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(checkForAuthentication);


app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', {
        urls: allUrls,
    });
})


app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/" , staticRoute);
app.use("/user",userRoute);


app.listen(PORT, () => console.log(`Server Started at ${PORT}`));


