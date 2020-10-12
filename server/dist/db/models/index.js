const mongoose = require("mongoose");
module.exports.connect = uri => {
    mongoose.connect(uri);
    // plug in the promise library: This seems not to be necessary in mongoose 5+
    mongoose.Promise = global.Promise;
    mongoose.connection.on("error", err => {
        console.error(`Mongoose connection error: ${err}`);
        process.exit(1);
    });
    // load models
    //require("./ImageSchema");
    require("./user");
    require("./score");
};
//# sourceMappingURL=index.js.map