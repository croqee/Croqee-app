const express = require('express');
const router = new express.Router();
const ScoreRepo = require('../db/repositories/scoreRepo');
router.get('/userscore', (req, res) => {
    ScoreRepo.getUsersTotalScore(req.user, (usersScore) => {
        if (usersScore) {
            res.status(200).json({
                usersScore: usersScore
            });
        }
    });
});
router.get('/scoredmodels', (req, res) => {
    ScoreRepo.getScoredModels(res2 => {
        if (res2) {
            res.status(200).json({
                scoredModels: res2
            });
        }
    });
});
module.exports = router;
//# sourceMappingURL=score.js.map