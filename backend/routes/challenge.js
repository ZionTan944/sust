const express = require('express');
const router = express.Router();
const challengeService = require('../services/challenge');

// list challenges
router.get('/all/:user_id', async (req, res, next) => {
  try {
    res.json(await challengeService.listChallenges(req.params.user_id));
  } catch (err) {
    console.error('Error listing challenges', err.message);
    next(err);
  }
});

// get challenge
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const ch = await challengeService.getChallenge(id);
    if (!ch) return res.status(404).json({ error: 'Not found' });
    res.json(ch);
  } catch (err) {
    console.error('Error getting challenge', err.message);
    next(err);
  }
});

// create challenge (simple, no auth)
router.post('/', async (req, res, next) => {
  try {
    const { title, description, points, created_by, active } = req.body || {};
    console.log('POST /challenges body:', req.body);
    if (!title || typeof points === 'undefined') return res.status(400).json({ error: 'Missing fields' });
    // coerce points to a number if possible
    const numericPoints = typeof points === 'number' ? points : (points ? Number(points) : undefined);
    if (typeof numericPoints === 'undefined' || Number.isNaN(numericPoints)) return res.status(400).json({ error: 'Invalid points value' });
    const ch = await challengeService.createChallenge({ title, description, points: numericPoints, created_by, active });
    res.status(201).json(ch);
  } catch (err) {
    console.error('Error creating challenge', err.message);
    next(err);
  }
});

// record completion for a user
// POST /challenges/:challengeid/complete
// body: { userid, evidence }
router.post('/:challengeid/complete', async (req, res, next) => {
  try {
    const challengeid = req.params.challengeid;
    const { userid  , evidence } = req.body || {};
    if (!userid) return res.status(400).json({ error: 'Missing userid in body' });
    const result = await challengeService.recordCompletion(userid, challengeid, evidence);
    if (result.alreadyCompleted) return res.status(409).json({ error: 'Challenge already completed by user' });
    res.status(201).json(result);
  } catch (err) {
    console.error('Error recording completion', err.message);
    next(err);
  }
});

// get user completions
// GET /challenges/user/:userid
router.get('/user/:userid', async (req, res, next) => {
  try {
    const userid = req.params.userid;
    res.json(await challengeService.getUserCompletions(userid));
  } catch (err) {
    console.error('Error getting user completions', err.message);
    next(err);
  }
});

// get user progress
// GET /challenges/user/:userid/progress
router.get('/user/:userid/progress', async (req, res, next) => {
  try {
    const userid = req.params.userid;
    res.json(await challengeService.getUserProgress(userid));
  } catch (err) {
    console.error('Error getting user progress', err.message);
    next(err);
  }
});

module.exports = router;
