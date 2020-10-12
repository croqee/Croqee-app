"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const passport_1 = __importDefault(require("passport"));
const config_1 = __importDefault(require("./config"));
const http_1 = __importDefault(require("http"));
const DrawingCompetitionController_1 = require("./controllers/drawing-competition/DrawingCompetitionController");
const app = express();
const logger = require("morgan");
const socketIO = require("socket.io");
var ioClient = require("socket.io-client");
const socketClient = ioClient.connect("http://server_python:9699", {
    reconnect: true
});
require("./db/models").connect(config_1.default.dbUri);
const { getUsersTotalScore } = require("./db/repositories/scoreRepo");
// tell the app to parse HTTP body messages
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb" }));
app.use("/uploads", express.static("uploads"));
app.use(body_parser_1.default.json({ limit: "50mb" }));
// pass the passport middleware
app.use(passport_1.default.initialize());
// load passport strategies
const localSignupStrategy = require("./passport/local-signup");
const localLoginStrategy = require("./passport/local-login");
passport_1.default.use("local-signup", localSignupStrategy);
passport_1.default.use("local-login", localLoginStrategy);
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
app.use(body_parser_1.default.json());
app.use(express.static(path_1.default.join(__dirname, "../../client/build")));
app.get('/*', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '../../client/build', 'index.html'));
});
getUsersTotalScore();
app.post("/send_drawing", (req, res, next) => {
    let param = {
        dataURL: req.body.dataURL,
        model: req.body.model,
        canvasWidth: req.body.canvasWidth,
        canvasHeight: req.body.canvasHeight
    };
    calculateScore(param, function (_res) {
        const result = JSON.parse(_res);
        res.json({
            score: Math.floor(result.score),
            img: result.img
        });
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
        error: {
            message: error.message
        }
    });
});
const server = http_1.default.createServer(app);
const calculateScore = (param, cb) => {
    socketClient.emit("calculate_score", param, function (res) {
        cb(res);
    });
};
//Drawing competitions
new DrawingCompetitionController_1.DrawingCompetitionController(socketIO, server, calculateScore, "still-life");
new DrawingCompetitionController_1.DrawingCompetitionController(socketIO, server, calculateScore, "anatomy");
server.listen(process.env.PORT || 8080);
//# sourceMappingURL=index.js.map