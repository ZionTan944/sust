const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /stall/ranking
// get stall rankings based on digestor usage
router.get('/ranking', async function (req, res, next) {
    try {
        const rows = await db.query(
            `SELECT s.name, s.shorten_location, count(d.stallid) as count FROM is463backend.stall s left join is463backend.digestor d on s.id = d.stallid GROUP BY d.stallid, s.name, s.shorten_location ORDER BY count DESC;`, []
        );
        res.json(rows);
    } catch (err) {
        console.error(`Error in /stall/ranking`, err.message);
        next(err);
    }
});

// GET /stall/:stallid
// get individual stall details
router.get('/:stallid', async function (req, res, next) {
    stallid = req.params.stallid;
    try {
        const rows = await db.query(
            `SELECT * FROM is463backend.stall where id = ?;`, [stallid]
        );

        res.json(rows[0])
    } catch (err) {
        console.error(`Error in /stall/:stallid`, err.message);
        next(err);
    }
});


module.exports = router;