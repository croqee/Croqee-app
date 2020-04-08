import { Express, Request, Response, NextFunction } from "express";
import express = require("express");
import path from "path";
import bodyParser from "body-parser";
import passport from "passport";
import config from "./config";
import http from "http";
import { drawingCompetitionController } from "./controllers/drawing-competition/drawingCompetitionController";
const app: Express = express();
const logger = require("morgan");
const zerorpc = require("zerorpc");
const socketIO = require("socket.io");
interface iError extends Error {
  status?: number;
}

const { pythonServerEndPoint } = require("./serverglobalvariables");

require("./db/models").connect(config.dbUri);
const { getUsersTotalScore } = require("./db/repositories/scoreRepo");

var node_client = new zerorpc.Client();
node_client.connect(pythonServerEndPoint);

// tell the app to parse HTTP body messages
app.use(bodyParser.json());
app.use(bodyParser({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require("./passport/local-signup");
const localLoginStrategy = require("./passport/local-login");
passport.use("local-signup", localSignupStrategy);
passport.use("local-login", localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require("./middleware/auth-check");
app.use("/api", authCheckMiddleware);
app.use("/score", authCheckMiddleware);

// routes
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const scoreRoutes = require("./routes/score");

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/score", scoreRoutes);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../../client/build")));

getUsersTotalScore();

app.post("/send_drawing", (req, res, next) => {
  let param = {
    dataURL: req.body.dataURL,
    model: req.body.model
  };
  node_client.invoke("DrawingDistance", param, function(
    error: any,
    res2: any,
    more: any
  ) {
    const result = JSON.parse(res2);

    res.json({
      score: Math.floor(result.score),
      img: result.img
    });
  });
});

// avoid python server sleeping
setInterval(() => {
  node_client.invoke("wakeUp");
}, 10000);

app.use((req, res, next) => {
  const error = new Error("Not Found") as iError;
  error.status = 404;
  next(error);
});

app.use((error: any, req: any, res: any, next: any) => {
  res.status(error.status || 500);

  res.json({
    error: {
      message: error.message
    }
  });
});

const server = http.createServer(app);
const io = socketIO(server);

//Drawing competitions
new drawingCompetitionController(io, node_client, "still_life");
new drawingCompetitionController(io, node_client, "anatomy");

server.listen(process.env.PORT || 8080);
