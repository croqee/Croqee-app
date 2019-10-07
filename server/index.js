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
// node_client.connect("tcp://localhost:9699");
const http = require('http')
const socketIO = require('socket.io')

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
    res.json({"greet":"Hey! Croqee App here!",
    "note":"something...bla bla"
});
});

app.post("/send_drawing",(req,res,next)=>{
    let dataURL = req.body.dataURL;
    node_client.invoke("DrawingDistance", dataURL, function(error, res2, more) {
       result = JSON.parse(res2)
       res.json(
           {
               "score":Math.floor(result.score),
               "img":result.img
    });
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

const server = http.createServer(app)

const io = socketIO(server);
io.on('connection', socket => {
  console.log('New client connected')
  
  // just like on the client side, we have a socket.on method that takes a callback function
  socket.on('username', (user) => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log('Username: ', user)
    io.sockets.emit( 'new_user', user.name)
  })
  
  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})


server.listen(process.env.PORT || 8080);

