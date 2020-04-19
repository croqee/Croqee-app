const express = require("express");
const User = require("mongoose").model("User");
const router = new express.Router();
let croqeeBodyParser = body => {
    var reqBody = {};
    for (var key in body) {
        reqBody = JSON.parse(key);
    }
    return reqBody;
};
router.get("/getuser", (req, res) => {
    res.status(200).json({
        user: req.user
    });
});
router.post("/updateuser/:id", (req, res) => {
    const userId = req.params.id;
    req.body = croqeeBodyParser(req.body);
    User.findOneAndUpdate({ _id: userId }, req.body, err => {
        if (err) {
            return res.status(400).json({ errors: "id not found." });
        }
        else {
            return res.status(204).json({ success: "updated" });
        }
    });
});
module.exports = router;
//# sourceMappingURL=api.js.map