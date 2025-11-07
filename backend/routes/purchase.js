const express = require('express');
const router = express.Router();
const db = require('../db');
require("dotenv").config();
const sharp = require('sharp');

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

        // get ranking
        rows = await db.query(
            `SELECT s.id, s.name, s.shorten_location, COUNT(d.stallid) as count, COALESCE(SUM(CAST(d.weight AS DECIMAL(10,2))), 0) as total_weight FROM stall s LEFT JOIN digestor d ON s.id = d.stallid GROUP BY s.id, s.name, s.shorten_location ORDER BY total_weight DESC, count DESC;`, []
        );

        // default points gained
        let points = 1;
        for (i = 0; i < 3; i++) {
            if (rows[i].name == stallName) {
                switch (i) {
                    case 1:
                        points = 20;
                        break;
                    case 2:
                        points = 10;
                        break;
                    case 3:
                        points = 5;
                        break;
                }
            }
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
            `SELECT c.id, count(p.id) as progress, c.count, c.points FROM sust.challenge c LEFT JOIN sust.purchase p on (c.stallid = p.stallid or c.stallid is null) and p.date_created >= c.date_created and userid = ? and active = 1 WHERE NOT EXISTS (SELECT 1 FROM sust.challenge_completion cc WHERE cc.challengeid = c.id AND cc.userid = ?) group by p.id, c.id having progress >= c.count;`, [userid, userid]
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