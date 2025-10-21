const db = require('../db');

async function getStallRankings() {
    const rows = await db.query(
        `SELECT s.name, s.shorten_location, count(d.stallid) as count FROM is463backend.stall s left join is463backend.digestor d on s.id = d.stallid GROUP BY d.stallid, s.name, s.shorten_location ORDER BY count DESC;`, []
    );
    return {
        rows
    }
}

async function getIndividualStall(stallid) {
    const rows = await db.query(
        `SELECT * FROM is463backend.stall where id = ?;`, [stallid]
    );
    return {
        rows
    }
}

module.exports = {
    getStallRankings,
    getIndividualStall
}