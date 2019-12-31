const express = require('express');
const router = new express.Router();
const ScoreRepo = require('../db/repositories/scoreRepo');
router.get('/getuserscores', (req, res) => {
    ScoreRepo.getUsersTotalScore(scores => {
        if (scores) {
            res.status(200).json({
                scores: scores
            });
        }
    });
});
module.exports = router;
//# sourceMappingURL=scores.js.map