const express = require('express');
const router = express.Router();
const db = require('../db');


// GET /digestor
// get total digestor count usage
router.get('/', async function (req, res, next) {
  try {
    const rows = await db.query(
      `SELECT count(stallid) as count FROM is463backend.digestor;`, []
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(`Error in /digestor`, err.message);
    next(err);
  }
});

// POST /digestor
// body: { stallid }
// create digestor usage
router.post('/', async function (req, res, next) {

  if (!req.body || !req.body.stallid) {
    return res.status(400).send("Missing stallid");
  }

  stallid = req.body.stallid;
  try {
    const rows = await db.query(
      `INSERT INTO is463backend.digestor (stallid) VALUES (?);`, [stallid]
    );

    res.json(rows)
  } catch (err) {
    console.error(`Error in POST /digestor`, err.message);
    next(err);
  }

})


module.exports = router;