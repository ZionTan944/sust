const mysql = require('mysql2/promise');
require('dotenv').config();

async function claimReward(userid, rewardId, metadata = {}) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
  });

  try {
    await connection.beginTransaction();

    // lock the reward row
    const [rewards] = await connection.execute('SELECT id, cost, valid_until FROM reward WHERE id = ? FOR UPDATE', [rewardId]);
    const reward = rewards && rewards[0] ? rewards[0] : null;
    if (!reward) {
      await connection.rollback();
      await connection.end();
      return { error: 'Reward not found', status: 404 };
    }

    // check validity
    const now = new Date();
    if (reward.valid_until && new Date(reward.valid_until) <= now) {
      await connection.rollback();
      await connection.end();
      return { error: 'Reward expired', status: 400 };
    }

    // lock and compute current balance
    const [balances] = await connection.execute('SELECT IFNULL(SUM(CAST(points AS SIGNED)),0) as balance FROM points WHERE userid = ? FOR UPDATE', [userid]);
    const balance = balances && balances[0] ? Number(balances[0].balance) : 0;

    if (balance < reward.cost) {
      await connection.rollback();
      await connection.end();
      return { error: 'Insufficient points', status: 400, balance };
    }

    // deduct points (insert negative transaction)
    const deduct = -Math.abs(Number(reward.cost));
    const [pointResult] = await connection.execute('INSERT INTO points (userid, points) VALUES (?, ?)', [userid, String(deduct)]);
    const pointId = pointResult.insertId;

    // insert redemption record
    const [redResult] = await connection.execute('INSERT INTO rewardredemption (userid, rewardid, pointid) VALUES (?, ?, ?)', [userid, rewardId, pointId]);
    const redemptionId = redResult.insertId;

    // new balance
    const [newBalRows] = await connection.execute('SELECT IFNULL(SUM(CAST(points AS SIGNED)),0) as balance FROM points WHERE userid = ?', [userid]);
    const newBalance = newBalRows && newBalRows[0] ? Number(newBalRows[0].balance) : 0;

    await connection.commit();
    await connection.end();

    return { redemptionId, pointId, rewardId, userid, newBalance };
  } catch (err) {
    try { await connection.rollback(); } catch (e) {}
    try { await connection.end(); } catch (e) {}
    throw err;
  }
}

module.exports = {
  claimReward
};
