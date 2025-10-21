const db = require('../db');

async function getTotalDigestor() {
  const rows = await db.query(
    `SELECT count(stallid) as count FROM is463backend.digestor;`, []
  );
  return {
    rows
  }
}


async function createDigestorUsage(stallid) {
  const rows = await db.query(
    `INSERT INTO is463backend.digestor (stallid) VALUES (?);`, [stallid]
  );
  return {
    rows
  }
}

module.exports = {
  getTotalDigestor,
  createDigestorUsage
}