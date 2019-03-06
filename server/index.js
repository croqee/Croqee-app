const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const logger = require("morgan");


app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client/build")));


app.post("/",(req,res,next)=>{
    res.json({"greet":"Hello World! Croqee App here!",
    "note":"By the way i got genrated by a request from Express server."});

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

app.listen(process.env.PORT || 5000);