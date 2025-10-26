const express = require('express');
const router = express.Router();
const db = require('../db');
const rewardService = require('../services/reward');

// Get all rewards
router.get('/all', async function (req, res, next) {
    try {
        const rows = await db.query(
            `SELECT *, (valid_until > CURRENT_TIMESTAMP) as "valid" FROM reward ORDER BY valid DESC;`, []
        );
        res.json(rows);
    } catch (err) {
        console.error(`Error in /stall/ranking`, err.message);
        next(err);
    }
});

// Get all valid rewards
router.get('/valid', async function (req, res, next) {
    try {
        const rows = await db.query(
            `SELECT * FROM reward WHERE valid_until > CURRENT_TIMESTAMP ORDER BY valid DESC;`, []
        );
        res.json(rows);
    } catch (err) {
        console.error(`Error in /stall/ranking`, err.message);
        next(err);
    }
});

// POST /rewards/:id/claim
// body: { userid }
router.post('/:id/claim', async function (req, res, next) {
    const rewardId = req.params.id;
    const { userid } = req.body || {};
    if (!userid) return res.status(400).json({ error: 'Missing userid in body' });
    try {
        const result = await rewardService.claimReward(userid, rewardId, req.body || {});
        if (result && result.error) return res.status(result.status || 400).json({ error: result.error, balance: result.balance });
        res.status(201).json(result);
    } catch (err) {
        console.error('Error claiming reward', err.message);
        next(err);
    }
});

module.exports = router;
