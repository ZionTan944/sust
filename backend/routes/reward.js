const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all rewards
router.get('/all', async function (req, res, next) {
    try {
        const rows = await db.query(
            `SELECT *, (valid_until > CURRENT_TIMESTAMP) as "valid" FROM is463backend.reward ORDER BY valid DESC;`, []
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
            `SELECT * FROM is463backend.reward WHERE valid_until > CURRENT_TIMESTAMP ORDER BY valid DESC;`, []
        );
        res.json(rows);
    } catch (err) {
        console.error(`Error in /stall/ranking`, err.message);
        next(err);
    }
});

module.exports = router;