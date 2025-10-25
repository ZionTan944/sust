const db = require('../db');

async function getAllStudentPoints() {
    const rows = await db.query(
        `SELECT u.username, u.faculty, IFNULL(sum(points),0) as points FROM is463backend.user u LEFT JOIN is463backend.points p on u.id = p.userid GROUP BY u.username, u.faculty ORDER BY points DESC;`, []
    );
    return {
        rows
    }
}

async function getUserPoints(userid) {
    const rows = await db.query(
        `SELECT IFNULL(SUM(CAST(points AS SIGNED)), 0) as points FROM is463backend.points WHERE userid = ?`, [userid]
    );
    // rows will be an array with one object containing points
    return {
        userid,
        points: (rows && rows[0] && rows[0].points) ? rows[0].points : 0
    }
}


module.exports = {
    getAllStudentPoints,
    getUserPoints
}