const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /stall/ranking
// get stall rankings based on digestor usage, with optional date filtering
router.get('/ranking', async function (req, res, next) {
    try {
        const range = req.query.range || 'all';
        
        // Map range to days
        const daysMap = {
            'daily': 1,
            'weekly': 7,
            'monthly': 30,
            'yearly': 365
        };
        
        let query;
        let params = [];
        
        if (range === 'all' || !daysMap[range]) {
            // No date filtering - get all data
            query = `SELECT s.id, s.name, s.shorten_location, COUNT(d.stallid) as count, COALESCE(SUM(CAST(d.weight AS DECIMAL(10,2))), 0) as total_weight FROM stall s LEFT JOIN digestor d ON s.id = d.stallid GROUP BY s.id, s.name, s.shorten_location ORDER BY total_weight DESC, count DESC;`;
        } else {
            // Filter by date range in JOIN condition to preserve LEFT JOIN behavior
            const days = daysMap[range];
            query = `SELECT s.id, s.name, s.shorten_location, COUNT(d.stallid) as count, COALESCE(SUM(CAST(d.weight AS DECIMAL(10,2))), 0) as total_weight FROM stall s LEFT JOIN digestor d ON s.id = d.stallid AND d.date_created >= DATE_SUB(NOW(), INTERVAL ? DAY) GROUP BY s.id, s.name, s.shorten_location ORDER BY total_weight DESC, count DESC;`;
            params = [days];
        }
        
        const rows = await db.query(query, params);
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
            `SELECT * FROM stall where id = ?;`, [stallid]
        );

        res.json(rows[0])
    } catch (err) {
        console.error(`Error in /stall/:stallid`, err.message);
        next(err);
    }
});

// GET /stall/:stallid/images
// get images for a stall. Supports optional ?limit= and ?offset= for pagination.
router.get('/:stallid/images', async function (req, res, next) {
    const stallid = req.params.stallid;
    try {
        // allow callers to request pagination. If not provided, return all images for the stall.
        // Pagination: support either (limit & offset) OR (page & pageSize)
        let limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
        let offset = req.query.offset ? parseInt(req.query.offset, 10) : null;
        const page = req.query.page ? parseInt(req.query.page, 10) : null;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : null;

        // If page is provided prefer page-based pagination
        if (Number.isInteger(page) && page > 0) {
            const size = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 12;
            limit = size;
            offset = (page - 1) * size;
        }

        // Build query. Use a single parameter for stallid and interpolate
        // numeric LIMIT/OFFSET directly after validating they're integers to
        // avoid prepared-statement argument mismatches in mysql2.
        let query = `SELECT id, image FROM sust.purchase WHERE stallid = ? AND image IS NOT NULL ORDER BY id DESC`;
        const params = [stallid];

        if (Number.isInteger(limit) && limit > 0) {
            query += ` LIMIT ${limit}`;
            if (Number.isInteger(offset) && offset >= 0) {
                query += ` OFFSET ${offset}`;
            }
        }

        const rows = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error(`Error in /stall/:stallid/images`, err.message);
        next(err);
    }
});


module.exports = router;