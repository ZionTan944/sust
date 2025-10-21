const db = require('../db');

async function getAllStudentPoints() {
    const rows = await db.query(
        `SELECT u.username, u.faculty, IFNULL(sum(points),0) as points FROM is463backend.user u LEFT JOIN is463backend.points p on u.id = p.userid GROUP BY u.username, u.faculty ORDER BY points DESC;`, []
    );
    return {
        rows
    }
}


module.exports = {
    getAllStudentPoints
}