import { Router } from 'express';
import {
  getScoredModels,
  getUsersTotalScore,
} from '../db/repositories/score-repo';

export const router = Router();

router.get('/userscore', (req, res) => {
  getUsersTotalScore(req.user, (usersScore) => {
    if (usersScore) {
      res.status(200).json({
        usersScore,
      });
    }
  });
});

router.get('/scoredmodels', (_req, res) => {
  getScoredModels((result) => {
    if (result) {
      res.status(200).json({
        scoredModels: result,
      });
    }
  });
});
