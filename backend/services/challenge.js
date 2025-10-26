const db = require('../db');

async function listChallenges() {
  const rows = await db.query('SELECT id, title, description, points, active, date_created FROM challenge WHERE active = 1', []);
  return rows;
}

async function getChallenge(id) {
  const rows = await db.query('SELECT id, title, description, points, active, date_created FROM challenge WHERE id = ? LIMIT 1', [id]);
  return rows && rows[0] ? rows[0] : null;
}

async function createChallenge({ title, description, points, created_by, active = 1 }) {
  const cb = (typeof created_by !== 'undefined' && created_by !== null) ? created_by : null;
  const act = (typeof active !== 'undefined' && active !== null) ? active : 1;
  // coerce/validate points: must be a number or null
  const pts = (typeof points === 'number') ? points : (typeof points !== 'undefined' && points !== null ? Number(points) : null);
  if (pts !== null && Number.isNaN(pts)) {
    throw new Error('Invalid points value');
  }
  console.log('Creating challenge with', { title, description, points: pts, created_by: cb, active: act });
  const result = await db.query('INSERT INTO challenge (title, description, points, created_by, active) VALUES (?, ?, ?, ?, ?)', [title, description || null, pts, cb, act]);
  const rows = await db.query('SELECT id, title, description, points, active, date_created FROM challenge WHERE id = ? LIMIT 1', [result.insertId]);
  return rows && rows[0] ? rows[0] : null;
}

async function recordCompletion(userid, challengeid, evidence) {
  // get challenge points
  const ch = await getChallenge(challengeid);
  if (!ch) throw new Error('Challenge not found');

  const points_awarded = ch.points || 0;

  // Prevent duplicate completions by the same user for the same challenge (policy: one-time completion)
  const existing = await db.query('SELECT id FROM challenge_completion WHERE userid = ? AND challengeid = ? LIMIT 1', [userid, challengeid]);
  if (existing && existing.length > 0) {
    return { alreadyCompleted: true };
  }

  // insert completion
  const result = await db.query('INSERT INTO challenge_completion (challengeid, userid, evidence, points_awarded) VALUES (?, ?, ?, ?)', [challengeid, userid, evidence || null, points_awarded]);

  // insert into points table to keep rankings consistent
  await db.query('INSERT INTO points (userid, points) VALUES (?, ?)', [userid, points_awarded]);

  const completionRows = await db.query('SELECT id, challengeid, userid, evidence, points_awarded, verified, date_completed FROM challenge_completion WHERE id = ? LIMIT 1', [result.insertId]);
  const completion = completionRows && completionRows[0] ? completionRows[0] : null;

  // compute totals
  const totals = await db.query('SELECT IFNULL(SUM(CAST(points AS SIGNED)),0) as points FROM points WHERE userid = ?', [userid]);
  const totalPoints = totals && totals[0] ? totals[0].points : 0;

  return { completion, totals: { points: totalPoints } };
}

async function getUserCompletions(userid) {
  const rows = await db.query(
    `SELECT cc.id, cc.challengeid, c.title, cc.date_completed, cc.points_awarded, cc.verified, cc.evidence
     FROM challenge_completion cc
     JOIN challenge c on cc.challengeid = c.id
     WHERE cc.userid = ? ORDER BY cc.date_completed DESC`, [userid]
  );
  return rows;
}

async function getUserProgress(userid) {
  const totals = await db.query('SELECT COUNT(*) as completed_count, IFNULL(SUM(points_awarded),0) as total_points FROM challenge_completion WHERE userid = ?', [userid]);
  const recent = await db.query('SELECT cc.challengeid, c.title, cc.date_completed, cc.points_awarded FROM challenge_completion cc JOIN challenge c ON cc.challengeid = c.id WHERE cc.userid = ? ORDER BY cc.date_completed DESC LIMIT 5', [userid]);
  return {
    userid,
    completed_count: totals && totals[0] ? totals[0].completed_count : 0,
    total_points: totals && totals[0] ? totals[0].total_points : 0,
    recent
  };
}

module.exports = {
  listChallenges,
  getChallenge,
  createChallenge,
  recordCompletion,
  getUserCompletions,
  getUserProgress
};
