const express = require('express');
const router = new express.Router();
router.get('/getuser', (req, res) => {
    res.status(200).json({
        user: req.user
    });
});
module.exports = router;
//# sourceMappingURL=api.js.map