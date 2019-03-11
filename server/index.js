const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const logger = require("morgan");
const zerorpc = require("zerorpc");

var node_client = new zerorpc.Client();
node_client.connect("tcp://127.0.0.1:9999");
 



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
        message = res2;
       res.json({"Your score":message});
    });   
 });


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

