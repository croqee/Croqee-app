"use strict";
var config;
(function (config) {
    config.dbUri = "mongodb+srv://croqee:yamaha3000@cluster0-9lzas.mongodb.net/test?retryWrites=true&w=majority";
    config.jwtSecret = "a secret phrase!!";
})(config || (config = {}));
module.exports = config;
//# sourceMappingURL=index.js.map