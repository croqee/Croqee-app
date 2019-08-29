const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const logger = require("morgan");
const zerorpc = require("zerorpc");
const passport = require("passport");
const config = require('./config');
const helpers = require('./helpers');
var node_client = new zerorpc.Client();
node_client.connect("tcp://server_python:9699");
//node_client.connect("tcp://localhost:9699");



require('./models').connect(config.dbUri);

// tell the app to parse HTTP body messages
app.use(bodyParser.json())
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);



app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../client/build")));


app.post("/",(req,res,next)=>{
    res.json({"greet":"Hello World! Croqee App here!",
    "note":"By the way i got genrated by a request from Express server."
});
});

app.post("/send_drawing",(req,res,next)=>{
    let dataURL = req.body.dataURL;
    node_client.invoke("DrawingDistance", dataURL, function(error, res2, more) {
        console.log(res2)
        message = Math.floor(res2);
       res.json({"score":message});
    });   
 });

 //avoid python server sleeping
setInterval(()=>{
    node_client.invoke("wakeUp");   
},
10000)

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);

    res.json({
        error:{
            message:error.message
        }
    });
});

app.listen(process.env.PORT || 8080);

