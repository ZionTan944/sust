const db = require('../db');

async function getAllStudentPoints() {
    const rows = await db.query(
        `SELECT u.username, u.faculty, IFNULL(sum(points),0) as points FROM user u LEFT JOIN points p on u.id = p.userid GROUP BY u.username, u.faculty ORDER BY points DESC;`, []
    );
    return {
        rows
    }
}

async function getUserPoints(userid) {
    const rows = await db.query(
        `SELECT IFNULL(SUM(CAST(points AS SIGNED)), 0) as points FROM points WHERE userid = ?`, [userid]
    );
    // rows will be an array with one object containing points
    return {
        userid,
        points: (rows && rows[0] && rows[0].points) ? rows[0].points : 0
    }
}

async function getUserPointsByRange(userid, range = 'all') {
    // range: 'week' => last 7 days, 'month' => last 30 days, 'all' => all time
    let sql, params;
    if (range === 'week') {
        // only count positive/earned points
        sql = `SELECT IFNULL(SUM(CAST(points AS SIGNED)),0) as points FROM points WHERE userid = ? AND points >= 0 AND date_created >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
        params = [userid];
    } else if (range === 'month') {
        // only count positive/earned points
        sql = `SELECT IFNULL(SUM(CAST(points AS SIGNED)),0) as points FROM points WHERE userid = ? AND points >= 0 AND date_created >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
        params = [userid];
    } else {
        // all time: only count positive/earned points
        sql = `SELECT IFNULL(SUM(CAST(points AS SIGNED)),0) as points FROM points WHERE userid = ? AND points >= 0`;
        params = [userid];
    }

    const rows = await db.query(sql, params);
    return {
        userid,
        range,
        points: (rows && rows[0] && typeof rows[0].points !== 'undefined') ? rows[0].points : 0
    };
}


module.exports = {
    getAllStudentPoints,
    getUserPoints,
    getUserPointsByRange
}