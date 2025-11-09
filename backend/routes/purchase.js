const express = require('express');
const router = express.Router();
const db = require('../db');
require("dotenv").config();
const sharp = require('sharp');

// Helper function to get grade based on total weight, usage frequency, and consistency
function getGrade(totalWeight, usage, period) {
    // Base score components (out of 100)
    let score = 0

    // 1. Weight component (40 points max)
    const weightThresholds = {
        'Daily': { excellent: 2, good: 1, threshold: 0.5 },
        'Weekly': { excellent: 10, good: 5, threshold: 2 },
        'Monthly': { excellent: 30, good: 15, threshold: 5 },
        'Year': { excellent: 300, good: 150, threshold: 50 }
    }

    const thresholds = weightThresholds[period] || weightThresholds['Weekly']

    if (totalWeight >= thresholds.excellent) {
        score += 40
    } else if (totalWeight >= thresholds.good) {
        score += 30
    } else if (totalWeight >= thresholds.threshold) {
        score += 20
    } else if (totalWeight > 0) {
        score += 10
    }

    // 2. Usage frequency component (30 points max)
    const usageThresholds = {
        'Daily': { excellent: 3, good: 2 },
        'Weekly': { excellent: 15, good: 8 },
        'Monthly': { excellent: 40, good: 20 },
        'Year': { excellent: 400, good: 200 }
    }

    const usageT = usageThresholds[period] || usageThresholds['Weekly']

    if (usage >= usageT.excellent) {
        score += 30
    } else if (usage >= usageT.good) {
        score += 20
    } else if (usage > 0) {
        score += 10
    }

    // 3. Consistency component (30 points max)
    const avgWeightPerUse = usage > 0 ? totalWeight / usage : 0

    if (avgWeightPerUse >= 0.8) {
        score += 30
    } else if (avgWeightPerUse >= 0.5) {
        score += 20
    } else if (avgWeightPerUse >= 0.3) {
        score += 10
    } else if (avgWeightPerUse > 0) {
        score += 5
    }

    // Convert score to letter grade
    if (score >= 80) return 'A'
    else if (score >= 60) return 'B'
    else if (score >= 40) return 'C'
    else if (score > 0) return 'D'
    else return 'F'
}


// POST /purchase/:userid
// Header Content-Type:application/octet-stream
// post a purchase
// 1. throw image to AI
// 2. update purchase table
// 3. update challenges
router.post('/:userid', async function (req, res, next) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ error: 'Missing fields' });
        const userid = req.params.userid;
        let buffer = req.body;

        buffer = await resizeImageBuffer(buffer);

        const azureResponse = await fetch(process.env.AZURE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "Prediction-Key": process.env.AZURE_PREDICTION_KEY
            },
            body: buffer,
        });

        if (!azureResponse.ok) {
            console.log("Get Azure CV failed");
            console.log(azureResponse);
            throw new Error("Get Azure CV failed");
        }

        const data = await azureResponse.json();

        // predicted stall
        const stallName = data.predictions[0].tagName;

        // insert into points

        // Map range to days
        period = "Weekly";

        const daysMap = {
            'Daily': 1,
            'Weekly': 7,
            'Monthly': 30,
            'Yearly': 365
        };
        // get ranking
        const days = daysMap[period];
        rows = await db.query(
            `SELECT s.id, s.name, s.shorten_location, COUNT(d.stallid) as count, COALESCE(SUM(CAST(d.weight AS DECIMAL(10,2))), 0) as total_weight FROM stall s LEFT JOIN digestor d ON s.id = d.stallid AND d.date_created >= DATE_SUB(NOW(), INTERVAL ? DAY) and s.name = ? GROUP BY s.id, s.name, s.shorten_location ORDER BY total_weight DESC, count DESC;`, [days, stallName]
        );

        // default points gained
        grade = getGrade(parseFloat(rows[0].total_weight) || 0, rows[0].count, period)
        let points = 0;
        switch (grade) {
            case "A":
                points = 20;
                break;
            case "B":
                points = 10;
                break;
            case "C":
                points = 5;
                break;
            case "D":
                points = 1;
                break
            default:
                points = 0;
        }

        // add to points table
        rows = await db.query(
            `INSERT INTO sust.points (userid, points) VALUES (?, ?);`, [userid, points]
        );

        // add to purchase table
        rows = await db.query(
            `INSERT INTO sust.purchase (userid, stallid, pointid, image) SELECT ?, id, ?, ? FROM sust.stall WHERE name = ?;`, [userid, rows.insertId, buffer, stallName]
        );

        // check if any challenges completed THAT does not already exist in challenge completion
        rows = await db.query(
            `SELECT c.id, count(p.userid) as progress, c.count, c.points FROM sust.challenge c LEFT JOIN sust.purchase p on (c.stallid = p.stallid or c.stallid is null) and p.date_created >= c.date_created and userid = ? and active = 1 WHERE NOT EXISTS (SELECT 1 FROM sust.challenge_completion cc WHERE cc.challengeid = c.id AND cc.userid = ?) group by p.userid, c.id having progress >= c.count;`, [userid, userid]
        );

        for (i = 0; i < rows.length; i++) {
            // complete challenges
            await db.query('INSERT INTO points (userid, points) VALUES (?, ?)', [userid, rows[i].points]);

            const result = await db.query('INSERT INTO challenge_completion (challengeid, userid, evidence, points_awarded) VALUES (?, ?, ?, ?)', [rows[i].id, userid, null, rows[i].points]);
        }

        res.status(201).json({ challengesCompleted: rows.length, stall: stallName });
    } catch (err) {
        console.error(`Error in /purchase/:userid`, err.message);
        next(err);
    }
});


// 4mb limit because thats the size limit for azure prediction API
async function resizeImageBuffer(buffer, maxSizeBytes = 4 * 1024 * 1024) {
    let quality = 90;
    let resizedBuffer = buffer;

    while (resizedBuffer.length > maxSizeBytes && quality > 10) {
        resizedBuffer = await sharp(buffer)
            .jpeg({ quality })
            .toBuffer();

        quality -= 10;
    }

    return resizedBuffer;
}


module.exports = router;