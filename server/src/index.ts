import { Express, Request, Response, NextFunction } from "express";
import express = require("express");
import path from "path";
import bodyParser from "body-parser";
import passport from "passport";
import config from "./config";
import http from "http";
import { DrawingCompetitionController } from "./controllers/drawing-competition/DrawingCompetitionController";

const app: Express = express();
const logger = require("morgan");
const socketIO = require("socket.io");
var ioClient = require("socket.io-client");
const socketClient = ioClient.connect("http://localhost:9699", {
  reconnect: true
});

interface iError extends Error {
  status?: number;
}

require("./db/models").connect(config.dbUri);
const { getUsersTotalScore } = require("./db/repositories/scoreRepo");

// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb" }));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json({ limit: "50mb" }));
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
app.use("/images", authCheckMiddleware);

// routes
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const scoreRoutes = require("./routes/score");
const ImageRouter = require("./routes/images");
const userImage = require("./routes/user-image");


app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/score", scoreRoutes);
app.use("/images", ImageRouter);
app.use("/user-image", userImage);


app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../../client/build")));

getUsersTotalScore();

app.post("/send_drawing", (req, res, next) => {
  let param = {
    dataURL: req.body.dataURL,
    model: req.body.model,
    canvasWidth: req.body.canvasWidth,
    canvasHeight: req.body.canvasHeight
  };
  calculateScore(param, function (_res: any) {
    const result = JSON.parse(_res);
    res.json({
      score: Math.floor(result.score),
      img: result.img
    });
  });
});

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

const calculateScore = (param: any, cb: Function) => {
  socketClient.emit("calculate_score", param, function (res: any) {
    cb(res);
  });
};
//Drawing competitions
new DrawingCompetitionController(
  socketIO,
  server,
  calculateScore,
  "still-life"
);
new DrawingCompetitionController(socketIO, server, calculateScore, "anatomy");

server.listen(process.env.PORT || 8080);
